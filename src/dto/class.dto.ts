import { IsBoolean, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../utils/trim.util';

export class CreateClassDto {
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    @Trim()
    description: string;

    @Matches(/\d{6}/)
    classNumber: string;

    @IsOptional()
    @IsBoolean()
    requirePermission: boolean;
}

export class UpdateClassDto {
    @IsOptional()
    @IsString()
    @Trim()
    @MinLength(1)
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    @Trim()
    description: string;

    @IsOptional()
    @Matches(/\d{6}/)
    classNumber: string;

    @IsOptional()
    @IsBoolean()
    requirePermission: boolean;
}

export class HideShowClassDto {
    @IsOptional()
    @IsBoolean()
    hidden: boolean;
}

export class JoinClassDto {
    @Matches(/\d{6}/)
    classNumber: string;
}
