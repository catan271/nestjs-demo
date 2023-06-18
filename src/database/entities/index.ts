import { Class } from './class.entity';
import { ClassStudent } from './classStudent.entity';
import { ClassTeacher } from './classTeacher.entity';
import { Key } from './key.entity';
import { Quiz } from './quiz.entity';
import { StudentAnswer } from './studentAnswer.entity';
import { User } from './user.entity';

export const entities = [User, Class, ClassTeacher, ClassStudent, Quiz, Key, StudentAnswer];
