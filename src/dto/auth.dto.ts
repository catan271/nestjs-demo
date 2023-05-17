import { IsEmail, IsIn, IsOptional, IsString, Matches } from 'class-validator';
import { User } from '../database/entities/user.entity';
import { Trim } from '../utils/trim.util';
import { roles } from '../constants/roles.constant';

export interface IRequest extends Request {
    user: User;
}

export class CreateUserDto {
    @IsEmail()
    @Trim()
    email: string;

    @IsString()
    password: string;

    @Trim()
    @IsString()
    familyName: string;

    @Trim()
    @IsString()
    givenName: string;

    @IsOptional()
    @Trim()
    @IsString()
    @Matches(/\d+/)
    studentNumber: string;

    @IsOptional()
    @Trim()
    @IsString()
    @Matches(/\d+/)
    mobile: string;

    @IsIn(Object.values(roles).map((e) => e.value))
    role: number;
}

export class LoginDto {
    @Trim()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class ChangePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}
