import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { MemberService } from '../../services/member.service';
import { AddMemberDto, GetListMembersDto, RemoveMembersDto } from '../../dto/member.dto';
import { IdParam, QueryDto } from '../../dto/common.dto';
import { UserService } from '../../services/user.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { roles } from '../../constants/roles.constant';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IRequest } from '../../dto/auth.dto';

@Controller('teacher/members')
@UseGuards(RolesGuard)
@Roles(roles.TEACHER.value)
export class TeacherMemberController {
    constructor(private memberService: MemberService, private userService: UserService) {}

    @Get('/users')
    async getListUsers(@Query() query: QueryDto) {
        return this.userService.getListUsers(query);
    }

    @Get('/')
    async getListMembers(@Query() query: GetListMembersDto) {
        return this.memberService.getMembers(query);
    }

    @Post('/')
    async addMemberToClass(@Req() { user }: IRequest, @Body() body: AddMemberDto) {
        return this.memberService.addMemberToClass(user.id, body);
    }

    @Patch('/:id')
    async acceptStudent(@Req() { user }: IRequest, @Param() { id }: IdParam) {
        return this.memberService.acceptStudent(user.id, id);
    }

    @Delete('/')
    async removeMembersFromClass(@Req() { user }: IRequest, @Body() body: RemoveMembersDto) {
        return this.memberService.removeMembersFromClass(user.id, body);
    }
}
