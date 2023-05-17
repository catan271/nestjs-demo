import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './database/orm.config';
import { entities } from './database/entities';
import { AuthController } from './controllers/auth.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [AuthModule, ConfigModule.forRoot(), TypeOrmModule.forRoot(options), TypeOrmModule.forFeature(entities)],
    controllers: [AuthController, UserController],
    providers: [UserService],
})
export class AppModule {}
