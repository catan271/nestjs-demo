import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Key } from '../../dto/quiz.dto';
import { instanceToInstance } from 'class-transformer';
import { Quiz } from './quiz.entity';

@Entity('keys')
export class KeyEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    quizId: number;

    @Column('json')
    keys: Key[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Quiz, (quiz) => quiz.key, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    quiz: Quiz;

    constructor(props: Partial<KeyEntity>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
