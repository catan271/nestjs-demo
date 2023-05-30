import { Controller, Get, Query } from '@nestjs/common';
import { MemberService } from '../../services/member.service';
import { GetListMembersDto } from '../../dto/member.dto';

@Controller('teacher/members')
export class TeacherMemberController {
    constructor(private memberService: MemberService) {}

    @Get('/')
    async getListMembers(@Query() query: GetListMembersDto) {
        return this.memberService.getMembers(query);
    }
}
