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
import { TeacherMemberController } from './controllers/teacher/member.controller';
import { MemberService } from './services/member.service';
import { TeacherQuizController } from './controllers/teacher/quiz.controller';
import { QuizService } from './services/quiz.service';
import { StudentClassController } from './controllers/student/class.controller';
import { StudentQuizController } from './controllers/student/quiz.controller';

@Module({
    imports: [AuthModule, ConfigModule.forRoot(), TypeOrmModule.forRoot(options), TypeOrmModule.forFeature(entities)],
    controllers: [
        AuthController,
        ConfigController,
        UserController,
        TeacherClassController,
        TeacherMemberController,
        TeacherQuizController,
        StudentClassController,
        StudentQuizController,
    ],
    providers: [ConfigService, UserService, ClassService, MemberService, QuizService],
})
export class AppModule {}
