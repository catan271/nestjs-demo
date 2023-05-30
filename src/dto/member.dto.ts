import { IsNumber } from 'class-validator';
import { QueryDto } from './common.dto';
import { Type } from 'class-transformer';

export class GetListMembersDto extends QueryDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;
}

export class CreateMemberDto {
    @IsNumber()
    userId: number;
}
