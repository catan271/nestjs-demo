import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class IdParam {
    @Type(() => Number)
    @IsNumber()
    id: number;
}

export class QueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    take?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    skip?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    email?: string;
}

export class IdsDto {
    @Type(() => Number)
    @IsNumber({}, { each: true })
    ids: number[];
}
