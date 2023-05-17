import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { accountStatus } from '../constants/accountStatus.constant';
import { errors } from '../constants/message.constant';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (!user || !(await compare(password, user.password))) {
            throw new HttpException(errors.WRONG_PASSWORD, HttpStatus.BAD_REQUEST);
        }

        if (user.status === accountStatus.INACTIVE.value) {
            throw new HttpException(errors.ACCOUNT_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
        }

        // if (user.deletedAt) {
        //     throw new HttpException('account_is_deleted_by_admin', HttpStatus.BAD_REQUEST);
        // }

        const accessToken = this.jwtService.sign(
            { id: user.id },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: '7d',
            },
        );

        return { user, accessToken };
    }

    async validateUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });

        if (!user) {
            throw new HttpException(errors.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (user.status === accountStatus.INACTIVE.value) {
            throw new HttpException(errors.ACCOUNT_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
        }

        // if (user.deletedAt) {
        //     throw new HttpException('account_is_deleted_by_admin', HttpStatus.BAD_REQUEST);
        // }

        return user;
    }

    async refreshAccessToken(user: User) {
        if (!user) {
            throw new HttpException(errors.INVALID_ACCESS_TOKEN, HttpStatus.BAD_REQUEST);
        }

        const accessToken = this.jwtService.sign(
            { id: user.id },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: '7d',
            },
        );

        return { user, accessToken };
    }

    async hashPassword(user: User) {
        user.password = await hash(user.password, 10);
        return user;
    }

    async changePassword(user: User, oldPassword: string, newPassword: string) {
        if (!user || !(await compare(oldPassword, user.password))) {
            throw new HttpException(errors.WRONG_PASSWORD, HttpStatus.BAD_REQUEST);
        }

        user.password = await hash(newPassword, 10);
        await this.userRepository.save(user);

        return user;
    }

    async validateEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: {
                email: email.toLowerCase(),
            },
            withDeleted: true,
        });

        if (!user) {
            throw new HttpException(errors.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (user.status === accountStatus.INACTIVE.value) {
            throw new HttpException(errors.ACCOUNT_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
        }

        // if (user.deletedAt) {
        //     throw new HttpException('account_is_deleted_by_admin', HttpStatus.BAD_REQUEST);
        // }

        return { response: 'Email is valid!' };
    }
}
