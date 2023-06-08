import { Allow, IsBoolean, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QueryDto } from './common.dto';

export class Question {
    @IsOptional()
    @IsNumber()
    questionId: number;

    @IsNumber()
    type: number;

    @IsString()
    question: string;

    @Allow()
    answers: any;
}
export class Key {
    @IsNumber()
    questionId: number;

    @Allow()
    answerId: any;

    @Allow()
    answerIds: any;

    @Allow()
    answer: any;
}

export class Answer {
    @IsNumber()
    answerId: number;

    @IsString()
    label: string;
}

export class QuestionSingleChoice extends Question {
    @ValidateNested({ each: true })
    @Type(() => Answer)
    answers: Answer[];
}
export class KeySingleChoice extends Key {
    @IsNumber()
    keyAnswerId: number;
}

export class QuestionMultipleChoices extends QuestionSingleChoice {}
export class KeyMultipleChoices extends Key {
    @IsNumber({}, { each: true })
    answerIds: number[];
}

export class QuestionFillIn extends Question {}
export class KeyFillIn extends Key {
    @IsString()
    answer: string;
}

export class Position {
    @IsNumber()
    lat: number;

    @IsNumber()
    long: number;
}

export class CreateQuizDto {
    @IsNumber()
    classId: number;

    @ValidateNested()
    @Type(() => Position)
    position: Position;

    @IsBoolean()
    shuffled: boolean;

    @IsOptional()
    @IsDate()
    closeTime: Date;

    @IsBoolean()
    open: boolean;

    @ValidateNested({ each: true })
    @Type(() => Question)
    questions: Question[];

    @ValidateNested({ each: true })
    @Type(() => Key)
    keys: Key[];
}

export class UpdateQuizDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => Position)
    position: Position;

    @IsOptional()
    @IsBoolean()
    shuffled: boolean;

    @IsOptional()
    @IsDate()
    closeTime: Date;

    @IsOptional()
    @IsBoolean()
    open: boolean;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Question)
    questions: Question[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Key)
    keys: Key[];
}

export class GetListQuizzesDto extends QueryDto {
    @IsNumber()
    classId: number;
}
