import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Position, Question } from '../../dto/quiz.dto';
import { instanceToInstance } from 'class-transformer';
import { Class } from './class.entity';
import { KeyEntity } from './key.entity';

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

    @OneToOne(() => KeyEntity, (key) => key.quiz, {
        cascade: true,
    })
    key: KeyEntity;

    constructor(props: Partial<Quiz>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
