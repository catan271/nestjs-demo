import { IsEmail, IsIn, IsString, Matches } from 'class-validator';
import { User } from '../database/entities/user.entity';
import { Trim } from '../utils/trim.util';
import { roles } from '../constants/roles.constant';

export interface IRequest extends Request {
    user: User;
}

export class CreateUserDto {
    @IsEmail()
    @Trim()
    public email: string;

    @IsString()
    public password: string;

    @Trim()
    @IsString()
    public familyName: string;

    @Trim()
    @IsString()
    public givenName: string;

    @Trim()
    @IsString()
    @Matches(/\d+/)
    public mobile: string;

    @IsIn(Object.values(roles).map((e) => e.value))
    public role: number;
}

export class LoginDto {
    @Trim()
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}
