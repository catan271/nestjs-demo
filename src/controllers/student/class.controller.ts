import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClassService } from '../../services/class.service';
import { IRequest } from '../../dto/auth.dto';
import { IdParam, QueryDto } from '../../dto/common.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { JoinClassDto } from '../../dto/class.dto';

@Controller('student/classes')
@UseGuards(RolesGuard)
@Roles(roles.STUDENT.value)
export class StudentClassController {
    constructor(private classService: ClassService) {}

    @Get('/')
    async getListClasses(@Req() { user }: IRequest, @Query() query: QueryDto) {
        return this.classService.getListClassesOfStudent(user.id, query);
    }

    @Post('/join')
    async joinClass(@Req() { user }: IRequest, @Body() body: JoinClassDto) {
        return this.classService.joinClass(user.id, body);
    }

    @Delete('/:id')
    async leaveClass(@Req() { user }: IRequest, @Param() { id }: IdParam) {
        return this.classService.leaveClass(user.id, id);
    }
}
