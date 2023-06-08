import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClassService } from './class.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../database/entities/quiz.entity';
import { Repository } from 'typeorm';
import { CreateQuizDto, GetListQuizzesDto } from '../dto/quiz.dto';
import { KeyEntity } from '../database/entities/key.entity';
import { validateQuestion } from '../utils/validateQuestions.util';
import { errors } from '../constants/message.constant';
import dayjs from 'dayjs';

@Injectable()
export class QuizService {
    constructor(
        private classService: ClassService,
        @InjectRepository(Quiz)
        private quizRepository: Repository<Quiz>,
        @InjectRepository(KeyEntity)
        private keyRepository: Repository<KeyEntity>,
    ) {}

    async createQuiz(userId: number, body: CreateQuizDto) {
        const { classId, questions, shuffled, closeTime, open, position, keys } = body;

        await this.classService.getClassOfTeacherById(userId, body.classId);
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
            key: new KeyEntity({
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

    async getQuizWithKeyById(userId: number, id: number) {
        const quiz = await this.quizRepository
            .createQueryBuilder('quiz')
            .innerJoin('quiz.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ id })
            .leftJoinAndSelect('quiz.key', 'key')
            .getOne();
        if (!quiz) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return quiz;
    }
}
