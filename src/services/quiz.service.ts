import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClassService } from './class.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../database/entities/quiz.entity';
import { Repository } from 'typeorm';
import { CreateQuizDto, DoQuizDto, GetListQuizzesDto, UpdateQuizDto } from '../dto/quiz.dto';
import { Key } from '../database/entities/key.entity';
import { validateQuestion } from '../utils/validateQuestions.util';
import { errors } from '../constants/message.constant';
import { IdsDto } from '../dto/common.dto';
import { geolocationToDistance } from '../utils/geolocation.util';
import { examineAnswers } from '../utils/examineAnswers.util';
import { StudentAnswer } from '../database/entities/studentAnswer.entity';
import { dayjs } from '../utils/dayjs.util';

@Injectable()
export class QuizService {
    constructor(
        private classService: ClassService,
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
        @InjectRepository(StudentAnswer)
        private studentAnswerRepository: Repository<StudentAnswer>,
    ) {}

    async createQuiz(userId: number, body: CreateQuizDto) {
        const { classId, questions, shuffled, closeTime, open, position, keys } = body;

        await this.classService.getClassOfTeacherById(userId, classId);
        if (!validateQuestion(questions, keys)) {
            throw new HttpException(errors.INVALID_QUESTIONS_AND_KEYS, HttpStatus.BAD_REQUEST);
        }
        if (open && !position) {
            throw new HttpException(errors.MISSING_POSITION, HttpStatus.BAD_REQUEST);
        }

        const quiz = new Quiz({
            classId,
            position,
            shuffled,
            closeTime,
            open,
            questions,
            key: new Key({
                keys,
            }),
        });
        if (open && dayjs(closeTime).isBefore(dayjs())) {
            quiz.closeTime = null;
        }
        return this.quizRepository.save(quiz);
    }

    async getListQuizzesOfClass(userId: number, { classId, take = 10, skip = 0 }: GetListQuizzesDto) {
        await this.classService.getClassOfTeacherById(userId, classId);

        const [records, total] = await this.quizRepository
            .createQueryBuilder('quiz')
            .where({ classId })
            .orderBy({
                'quiz.id': 'DESC',
            })
            .take(take)
            .skip(skip)
            .getManyAndCount();

        return { take, skip, records, total };
    }

    async getListQuizzesOfClassStudent(userId: number, { classId, take = 10, skip = 0 }: GetListQuizzesDto) {
        const _class = await this.classService.getClassOfStudentById(userId, classId);

        const [records, total] = await this.quizRepository
            .createQueryBuilder('quiz')
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer', 'studentAnswer.studentId = :studentId', {
                studentId: _class.classStudents[0].id,
            })
            .where({ classId })
            .orderBy({
                'quiz.id': 'DESC',
            })
            .take(take)
            .skip(skip)
            .getManyAndCount();

        return { take, skip, records, total };
    }

    async getQuizById(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async getQuizByIdStudent(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin(
                'class.classStudents',
                'classStudent',
                'classStudent.userId = :userId AND classStudent.waiting = 0',
                { userId },
            )
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async getQuizWithKeyById(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoinAndSelect('quiz.class', 'class')
            .innerJoinAndSelect('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .leftJoinAndSelect('quiz.key', 'key')
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async getQuizWithKeyByIdStudent(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoinAndSelect('quiz.class', 'class')
            .innerJoinAndSelect(
                'class.classStudents',
                'classStudent',
                'classStudent.userId = :userId AND classStudent.waiting = 0',
                { userId },
            )
            .leftJoinAndSelect('quiz.key', 'key')
            .where({ id })
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }

    async updateQuiz(userId: number, id: number, body: UpdateQuizDto) {
        const { questions, shuffled, closeTime, open, position, keys } = body;

        const quiz = await this.getQuizById(userId, id);
        quiz.shuffled = shuffled;
        quiz.closeTime = closeTime;
        if (questions) {
            if (!validateQuestion(questions, keys)) {
                throw new HttpException(errors.INVALID_QUESTIONS_AND_KEYS, HttpStatus.BAD_REQUEST);
            }
            quiz.questions = questions;
            quiz.key.keys = keys;
        }
        if (open) {
            if (position) {
                throw new HttpException(errors.MISSING_POSITION, HttpStatus.BAD_REQUEST);
            }
            quiz.open = open;
            quiz.position = position;
        }
        if (open && dayjs(closeTime).isBefore(dayjs())) {
            quiz.closeTime = null;
        }

        return this.quizRepository.save(quiz);
    }

    async deleteQuizzes(userId: number, { ids }: IdsDto) {
        const validQuizzes = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.id = :userId', { userId })
            .where('id IN(:ids)', { ids })
            .getMany();
        const quizIds = validQuizzes.map((e) => e.id);
        return this.quizRepository.delete(quizIds);
    }

    async doQuiz(userId: number, quizId: number, { position, answers }: DoQuizDto) {
        const quiz = await this.getQuizWithKeyByIdStudent(userId, quizId);
        const classStudentId = quiz.class.classStudents[0].id;

        if (!quiz.open || dayjs(quiz.closeTime).isBefore(dayjs())) {
            throw new HttpException(errors.QUIZ_CLOSED, HttpStatus.BAD_REQUEST);
        }
        if (await this.studentAnswerRepository.findOneBy({ classStudentId, quizId })) {
            throw new HttpException(errors.QUIZ_DONE, HttpStatus.BAD_REQUEST);
        }
        if (!quiz.position) {
            throw new HttpException(errors.MISSING_POSITION, HttpStatus.CONFLICT);
        }
        if (geolocationToDistance(position, quiz.position) > 80) {
            throw new HttpException(errors.TOO_DISTANCED, HttpStatus.BAD_REQUEST);
        }
        const points = examineAnswers(answers, quiz.key.keys);
        if (points === -1) {
            throw new HttpException(errors.INVALID_QUESTIONS_AND_KEYS, HttpStatus.BAD_REQUEST);
        }

        return this.studentAnswerRepository.save(
            new StudentAnswer({
                quizId,
                classStudentId,
                position,
                answers,
                correct: points,
                total: quiz.questions.length,
            }),
        );
    }
}
