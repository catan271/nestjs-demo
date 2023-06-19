import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClassService } from '../../services/class.service';
import { IRequest } from '../../dto/auth.dto';
import { IdParam, QueryDto } from '../../dto/common.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { HideShowClassDto, JoinClassDto } from '../../dto/class.dto';

@Controller('student/classes')
@UseGuards(RolesGuard)
@Roles(roles.STUDENT.value)
export class StudentClassController {
    constructor(private classService: ClassService) {}

    @Get('/')
    async getListClasses(@Req() { user }: IRequest, @Query() query: QueryDto) {
        return this.classService.getListClassesOfStudent(user.id, query);
    }

    @Get('/:id')
    async getClassById(@Req() { user }: IRequest, @Param() { id }: IdParam) {
        return this.classService.getClassOfStudentById(user.id, id);
    }

    @Post('/join')
    async joinClass(@Req() { user }: IRequest, @Body() body: JoinClassDto) {
        return this.classService.joinClass(user.id, body);
    }

    @Patch('/:id')
    async hideShowClass(@Req() { user }: IRequest, @Param() { id }: IdParam, @Body() body: HideShowClassDto) {
        return this.classService.hideShowClassStudent(user.id, id, body);
    }

    @Delete('/:id')
    async leaveClass(@Req() { user }: IRequest, @Param() { id }: IdParam) {
        return this.classService.leaveClass(user.id, id);
    }
}
