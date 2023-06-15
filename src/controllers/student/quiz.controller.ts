import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { QuizService } from '../../services/quiz.service';
import { IRequest } from '../../dto/auth.dto';
import { GetListQuizzesDto } from '../../dto/quiz.dto';
import { IdParam } from '../../dto/common.dto';

@Controller('student/quizzes')
@UseGuards(RolesGuard)
@Roles(roles.STUDENT.value)
export class StudentQuizController {
    constructor(private quizService: QuizService) {}

    @Get('/')
    async getListQuizzes(@Req() { user }: IRequest, @Query() query: GetListQuizzesDto) {
        return this.quizService.getListQuizzesOfClassStudent(user.id, query);
    }

    @Get('/:id')
    async getQuizById(@Req() { user }: IRequest, @Param() { id }: IdParam) {
        return this.quizService.getQuizByIdStudent(user.id, id);
    }
}
