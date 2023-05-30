import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth.dto';
import { errors } from '../constants/message.constant';
import { AuthService } from '../auth/auth.service';
import { roles } from '../constants/roles.constant';
import { UpdateUserDto } from '../dto/user.dto';
import { QueryDto } from '../dto/common.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private authService: AuthService,
    ) {}

    async createUser(body: CreateUserDto) {
        if (body.role === roles.STUDENT.value && !body.studentNumber) {
            throw new HttpException(errors.STUDENT_NUMBER_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const existingUser = await this.userRepository.findOne({
            where: { email: body.email },
            withDeleted: true,
        });

        if (existingUser) {
            if (existingUser.deletedAt) {
                await this.userRepository.remove(existingUser);
            }
            throw new HttpException(errors.EMAIL_TAKEN, HttpStatus.BAD_REQUEST);
        }

        const user = new User(body);

        await this.authService.hashPassword(user);

        await this.userRepository.save(user);

        return this.authService.login(body.email, body.password);
    }

    async updateUser(user: User, body: UpdateUserDto) {
        Object.assign(user, body);

        if (user.role === roles.STUDENT.value && !user.studentNumber) {
            throw new HttpException(errors.STUDENT_NUMBER_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        return this.userRepository.save(user);
    }

    async deleteUser(user: User) {
        return this.userRepository.softRemove(user);
    }

    async getListUsers({ search = '', take = 10, skip = 0 }: QueryDto) {
        search = '%' + search.replace(/\s+/g, '%') + '%';
        const [records, total] = await this.userRepository.findAndCount({
            where: [{ email: ILike(search) }, { givenName: ILike(search) }, { familyName: ILike(search) }],
            take,
            skip,
        });
        return { take, skip, total, records };
    }
}
