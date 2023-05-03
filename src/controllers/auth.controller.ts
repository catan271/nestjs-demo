import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto, LoginDto } from '../dto/auth.dto';
import { IRequest } from '../dto/auth.dto';
import { UserService } from '../services/user.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }

    @Get('refresh-token')
    @UseGuards(RolesGuard)
    async refreshToken(@Req() { user }: IRequest) {
        return this.authService.refreshAccessToken(user);
    }
}
