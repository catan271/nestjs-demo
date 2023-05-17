import { IsOptional, IsString, Matches } from 'class-validator';
import { Trim } from '../utils/trim.util';

export class UpdateUserDto {
    @IsOptional()
    @Trim()
    @IsString()
    familyName: string;

    @IsOptional()
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
}
