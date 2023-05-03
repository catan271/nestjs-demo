import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/auth.dto';
import { errors } from '../constants/message.constant';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private authService: AuthService,
    ) {}

    async createUser(body: CreateUserDto) {
        if (
            await this.userRepository.findOneBy({
                email: body.email,
            })
        ) {
            throw new HttpException(errors.EMAIL_TAKEN, HttpStatus.BAD_REQUEST);
        }

        const user = new User(body);

        await this.authService.hashPassword(user);

        await this.userRepository.save(user);

        return this.authService.login(body.email, body.password);
    }
}
