import { Controller, UseGuards, Post, Delete, Body, Req } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from '../services/user.service';
import { IRequest } from '../dto/auth.dto';
import { UpdateUserDto } from '../dto/user.dto';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Post('')
    async updateUser(@Req() { user }: IRequest, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(user, body);
    }

    @Delete()
    async deleteUser(@Req() { user }: IRequest) {
        return this.userService.deleteUser(user);
    }
}
