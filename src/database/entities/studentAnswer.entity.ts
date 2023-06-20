import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Position, StudentAnswerDto } from '../../dto/quiz.dto';
import { instanceToInstance } from 'class-transformer';
import { ClassStudent } from './classStudent.entity';
import { Quiz } from './quiz.entity';

@Entity('student_answers')
export class StudentAnswer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    classStudentId: number;

    @Column('int')
    quizId: number;

    @Column('json')
    position: Position;

    @Column('json')
    answers: StudentAnswerDto[];

    @Column('int', {
        nullable: true,
    })
    correct: number;

    @Column('int', {
        nullable: true,
    })
    total: number;

    @ManyToOne(() => ClassStudent, (classStudent) => classStudent.studentAnswers, {
        onDelete: 'CASCADE',
    })
    classStudent: ClassStudent;

    @ManyToOne(() => Quiz, (quiz) => quiz.studentAnswers, {
        onDelete: 'CASCADE',
    })
    quiz: Quiz;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(props: Partial<StudentAnswer>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
