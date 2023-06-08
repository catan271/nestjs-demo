import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { QuizService } from '../../services/quiz.service';
import { IRequest } from '../../dto/auth.dto';
import { CreateQuizDto, GetListQuizzesDto } from '../../dto/quiz.dto';
import { IdParam } from '../../dto/common.dto';

@Controller('teacher/quizzes')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class TeacherQuizController {
    constructor(private quizService: QuizService) {}

    @Get('/')
    async getListQuizzesOfClass(@Req() { user }: IRequest, @Query() query: GetListQuizzesDto) {
        return this.quizService.getListQuizzesOfClass(user.id, query);
    }

    @Get('/:id')
    async getQuizById(@Req() { user }: IRequest, @Param() { id }: IdParam) {
        return this.quizService.getQuizWithKeyById(user.id, id);
    }

    @Post('/')
    async createQuiz(@Req() { user }: IRequest, @Body() body: CreateQuizDto) {
        return this.quizService.createQuiz(user.id, body);
    }
}
