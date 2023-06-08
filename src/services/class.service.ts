import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassTeacher } from '../database/entities/classTeacher.entity';
import { In, Not, Repository } from 'typeorm';
import { ClassStudent } from '../database/entities/classStudent.entity';
import { IdsDto, QueryDto } from '../dto/common.dto';
import { Class } from '../database/entities/class.entity';
import { CreateClassDto, UpdateClassDto } from '../dto/class.dto';
import { errors } from '../constants/message.constant';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Class)
        private classRepository: Repository<Class>,
        @InjectRepository(ClassTeacher)
        private classTeacherRepository: Repository<ClassTeacher>,
        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>,
    ) {}

    async getListClassesOfTeacher(userId: number, { search = '', take, skip }: QueryDto) {
        const query = this.classTeacherRepository
            .createQueryBuilder('teacherClass')
            .innerJoinAndSelect('teacherClass.class', 'class')
            .where({
                userId,
            })
            .take(take)
            .skip(skip);
        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere('(UPPER(class.name) LIKE UPPER(:search) OR class.classNumber LIKE :search)', { search });
        }
        const [records, total] = await query.getManyAndCount();

        return { take, skip, total, records };
    }

    async getClassOfTeacherById(userId: number, classId: number) {
        const _class = await this.classRepository
            .createQueryBuilder('class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ id: classId })
            .getOne();
        if (!_class) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return _class;
    }

    async getClassOfStudentById(userId: number, classId: number) {
        const _class = await this.classRepository
            .createQueryBuilder('class')
            .innerJoin('class.classStudents', 'classStudent', 'classStudent.userId = :userId', { userId })
            .where({ id: classId })
            .getOne();
        if (!_class) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return _class;
    }

    async createClass(userId: number, body: CreateClassDto) {
        if (await this.classRepository.findOneBy({ classNumber: body.classNumber })) {
            throw new HttpException(errors.CLASS_NUMBER_TAKEN, HttpStatus.BAD_REQUEST);
        }

        const _class = new Class(body);
        _class.classTeachers = [
            new ClassTeacher({
                userId,
            }),
        ];

        return this.classRepository.save(_class);
    }

    async updateClass(userId: number, classId: number, body: UpdateClassDto) {
        const _class = await this.getClassOfTeacherById(userId, classId);

        if (await this.classRepository.findOneBy({ classNumber: body.classNumber, id: Not(classId) })) {
            throw new HttpException(errors.CLASS_NUMBER_TAKEN, HttpStatus.BAD_REQUEST);
        }

        Object.assign(_class, body);

        return this.classRepository.save(_class);
    }

    async deleteClasses(userId: number, { ids }: IdsDto) {
        const teacherClasses = await this.classTeacherRepository.findBy({
            classId: In(ids),
            userId,
        });
        const classIds = teacherClasses.map((e) => e.classId);
        return this.classRepository.delete(classIds);
    }
}
