import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { IRequest } from '../../dto/auth.dto';
import { IdParam, IdsDto, QueryDto } from '../../dto/common.dto';
import { ClassService } from '../../services/class.service';
import { CreateClassDto, UpdateClassDto } from '../../dto/class.dto';

@Controller('teacher/classes')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class TeacherClassController {
    constructor(private classService: ClassService) {}

    @Get('/')
    async getListClasses(@Req() { user }: IRequest, @Query() query: QueryDto) {
        return this.classService.getListClassesOfTeacher(user.id, query);
    }

    @Post('/')
    async createClass(@Req() { user }: IRequest, @Body() body: CreateClassDto) {
        return this.classService.createClass(user.id, body);
    }

    @Put('/:id')
    async updateClass(@Req() { user }: IRequest, @Param() { id }: IdParam, @Body() body: UpdateClassDto) {
        return this.classService.updateClass(user.id, id, body);
    }

    @Delete('/')
    async deleteClasses(@Req() { user }: IRequest, @Body() body: IdsDto) {
        return this.classService.deleteClasses(user.id, body);
    }
}
