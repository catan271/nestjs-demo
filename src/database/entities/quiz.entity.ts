import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Position, Question } from '../../dto/quiz.dto';
import { instanceToInstance } from 'class-transformer';
import { Class } from './class.entity';
import { Key } from './key.entity';
import { StudentAnswer } from './studentAnswer.entity';

@Entity('quizzes')
export class Quiz extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    classId: number;

    @Column('json', {
        nullable: true,
    })
    position: Position | null;

    @Column('bool', {
        default: false,
    })
    shuffled: boolean;

    @Column('timestamp', {
        nullable: true,
    })
    closeTime: Date | null;

    @Column('bool', {
        default: true,
    })
    open: boolean;

    @Column('json')
    questions: Question[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Class, (_class) => _class.quizzes, {
        onDelete: 'CASCADE',
    })
    class: Class;

    @OneToOne(() => Key, (key) => key.quiz, {
        cascade: true,
    })
    key: Key;

    @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.quiz, {
        onDelete: 'CASCADE',
    })
    studentAnswers: StudentAnswer[];

    constructor(props: Partial<Quiz>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
