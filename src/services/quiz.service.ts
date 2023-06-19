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
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer', 'studentAnswer.classStudent = :studentId', {
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
            .innerJoinAndSelect('quiz.key', 'key')
            .leftJoinAndSelect('quiz.studentAnswers', 'studentAnswer')
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

    async createQuiz(userId: number, body: CreateQuizDto) {
        const { keys, ...data } = body;

        await this.classService.getClassOfTeacherById(userId, data.classId);

        const quiz = new Quiz({
            ...data,
            key: new Key({
                keys,
            }),
        });
        if (!validateQuestion(quiz.questions, keys)) {
            throw new HttpException(errors.INVALID_QUESTIONS_AND_KEYS, HttpStatus.BAD_REQUEST);
        }
        if (quiz.open && !data.position) {
            throw new HttpException(errors.MISSING_POSITION, HttpStatus.BAD_REQUEST);
        }
        if (quiz.open && dayjs(quiz.closeTime).isBefore(dayjs())) {
            quiz.closeTime = null;
        }
        return this.quizRepository.save(quiz);
    }

    async updateQuiz(userId: number, id: number, body: UpdateQuizDto) {
        const { keys, ...data } = body;

        const quiz = await this.getQuizById(userId, id);
        Object.assign(quiz, data);
        if (data.questions) {
            if (!validateQuestion(quiz.questions, keys)) {
                throw new HttpException(errors.INVALID_QUESTIONS_AND_KEYS, HttpStatus.BAD_REQUEST);
            }
            quiz.key.keys = keys;
        }
        if (quiz.open && !data.position) {
            throw new HttpException(errors.MISSING_POSITION, HttpStatus.BAD_REQUEST);
        }
        if (quiz.open && dayjs(quiz.closeTime).isBefore(dayjs())) {
            quiz.closeTime = null;
        }

        return this.quizRepository.save(quiz);
    }

    async deleteQuizzes(userId: number, { ids }: IdsDto) {
        const validQuizzes = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where('quiz.id IN(:ids)', { ids })
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
            throw new HttpException(errors.INVALID_ANSWER, HttpStatus.BAD_REQUEST);
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
