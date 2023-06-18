import { instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';
import { StudentAnswer } from './studentAnswer.entity';

@Entity('class_students')
export class ClassStudent extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    classId: number;

    @Column('int')
    userId: number;

    @Column('bool', {
        default: false,
    })
    hidden: boolean;

    @Column('bool', {
        default: false,
    })
    waiting: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Class, (_class) => _class.classStudents, {
        onDelete: 'CASCADE',
    })
    class: Class;

    @ManyToOne(() => User, (user) => user.classStudents, {
        onDelete: 'CASCADE',
    })
    user: User;

    @OneToMany(() => StudentAnswer, (studentAnswer) => studentAnswer.classStudent, {
        cascade: true,
    })
    studentAnswers: StudentAnswer[];

    constructor(props: Partial<ClassStudent>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
