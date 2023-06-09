import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassTeacher } from '../database/entities/classTeacher.entity';
import { In, Repository } from 'typeorm';
import { ClassStudent } from '../database/entities/classStudent.entity';
import { AddMemberDto, GetListMembersDto, RemoveMembersDto } from '../dto/member.dto';
import { ClassService } from './class.service';
import { UserService } from './user.service';
import { roles } from '../constants/roles.constant';
import { errors } from '../constants/message.constant';

@Injectable()
export class MemberService {
    constructor(
        private userService: UserService,
        private classService: ClassService,
        @InjectRepository(ClassTeacher)
        private classTeacherRepository: Repository<ClassTeacher>,
        @InjectRepository(ClassStudent)
        private classStudentRepository: Repository<ClassStudent>,
    ) {}

    async getMembers({ classId, search = '', take, skip }: GetListMembersDto) {
        const teachers = await this.classTeacherRepository.find({
            where: {
                classId,
            },
            order: {
                id: 'ASC',
            },
            relations: ['user'],
        });

        const query = this.classStudentRepository
            .createQueryBuilder('classStudent')
            .innerJoinAndSelect('classStudent.user', 'user')
            .where({ classId })
            .orderBy({
                'classStudent.waiting': 'DESC',
                'classStudent.id': 'DESC',
            })
            .take(take)
            .skip(skip);
        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere(
                'UPPER(user.email) LIKE UPPER(:search) OR UPPER(user.givenName) LIKE UPPER(:search) OR UPPER(user.familyName) LIKE UPPER(:search)',
                { search },
            );
        }
        const [records, total] = await query.getManyAndCount();

        return {
            teachers: { records: teachers },
            students: { take, skip, total, records },
        };
    }

    async addMemberToClass(teacherId: number, { classId, userId }: AddMemberDto) {
        await this.classService.getClassOfTeacherById(teacherId, classId);

        const user = await this.userService.getUserById(userId);
        if (user.role === roles.TEACHER.value) {
            if (await this.classTeacherRepository.findOneBy({ classId, userId })) {
                throw new HttpException(errors.MEMBER_ALREADY_IN_CLASS, HttpStatus.BAD_REQUEST);
            }
            await this.classTeacherRepository.save({ classId, userId });
        } else if (user.role === roles.STUDENT.value) {
            if (await this.classStudentRepository.findOneBy({ classId, userId })) {
                throw new HttpException(errors.MEMBER_ALREADY_IN_CLASS, HttpStatus.BAD_REQUEST);
            }
            await this.classStudentRepository.save({ classId, userId });
        }

        return { message: 'ok' };
    }

    async acceptStudent(userId: number, id: number) {
        const student = await this.classStudentRepository
            .createQueryBuilder('classStudent')
            .innerJoin('classStudent.class', 'class')
            .innerJoin('class.classTeachers', 'classTeacher', 'classTeacher.userId = :userId', { userId })
            .where({ id })
            .getOne();

        if (!student) {
            throw new HttpException(errors.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        student.waiting = false;
        return this.classStudentRepository.save(student);
    }

    async removeMembersFromClass(teacherId: number, { classId, ids }: RemoveMembersDto) {
        if (ids.includes(teacherId)) {
            throw new HttpException(errors.DELETE_SELF, HttpStatus.BAD_REQUEST);
        }
        await this.classService.getClassOfTeacherById(teacherId, classId);
        await this.classTeacherRepository.delete({ classId, userId: In(ids) });
        await this.classStudentRepository.delete({ classId, userId: In(ids) });
        return { message: 'ok' };
    }
}
