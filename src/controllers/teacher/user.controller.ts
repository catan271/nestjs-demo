import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { UserService } from '../../services/user.service';
import { QueryDto } from '../../dto/common.dto';

@Controller('teacher/users')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class TeacherUserController {
    constructor(private userService: UserService) {}

    @Get('/')
    async findUsersByEmail(@Query() query: QueryDto) {
        return this.userService.getListUsers(query);
    }
}
