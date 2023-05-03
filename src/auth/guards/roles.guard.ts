import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
        if (!user) {
            throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const roles = this.reflector.get<string[]>('roles', context.getClass());
        if (!roles) {
            return user;
        }

        if (!roles.includes(user.role)) {
            throw new HttpException('permission_not_granted', HttpStatus.FORBIDDEN);
        }

        return user;
    }
}
