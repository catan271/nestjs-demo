import { IsNumber } from 'class-validator';
import { IdsDto, QueryDto } from './common.dto';
import { Type } from 'class-transformer';

export class GetListMembersDto extends QueryDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;
}

export class AddMemberDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;

    @Type(() => Number)
    @IsNumber()
    userId: number;
}

export class RemoveMembersDto extends IdsDto {
    @Type(() => Number)
    @IsNumber()
    classId: number;
}
