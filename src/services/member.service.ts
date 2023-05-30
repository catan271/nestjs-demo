import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassTeacher } from '../database/entities/classTeacher.entity';
import { Repository } from 'typeorm';
import { ClassStudent } from '../database/entities/classStudent.entity';
import { GetListMembersDto } from '../dto/member.dto';

@Injectable()
export class MemberService {
    constructor(
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
            relations: ['user'],
        });

        const query = this.classStudentRepository
            .createQueryBuilder('classStudent')
            .innerJoinAndSelect('classStudent.user', 'user')
            .where({ classId });

        if (search) {
            search = '%' + search.replace(/\s+/g, '%') + '%';
            query.andWhere(
                'UPPER(user.email) LIKE UPPER(:search) OR UPPER(user.givenName) LIKE UPPER(:search) OR UPPER(user.familyName) LIKE UPPER(:search)',
                { search },
            );
        }
        if (take) {
            query.take(take);
        }
        if (skip) {
            query.skip(skip);
        }

        const [records, total] = await query.getManyAndCount();
        return {
            teachers: { records: teachers },
            students: { take, skip, records, total },
        };
    }
}
