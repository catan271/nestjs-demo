import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { options } from './database/orm.config';
import { entities } from './database/entities';
import { AuthController } from './controllers/auth.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { ClassService } from './services/class.service';
import { TeacherClassController } from './controllers/teacher/class.controller';
import { ConfigController } from './controllers/config.controller';
import { ConfigService } from './services/config.service';

@Module({
    imports: [AuthModule, ConfigModule.forRoot(), TypeOrmModule.forRoot(options), TypeOrmModule.forFeature(entities)],
    controllers: [AuthController, ConfigController, UserController, TeacherClassController],
    providers: [ConfigService, UserService, ClassService],
})
export class AppModule {}
