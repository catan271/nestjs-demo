import { instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';

@Entity('class_students')
export class ClassStudent extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    classId: number;

    @Column('int')
    studentId: number;

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

    constructor(props: Partial<ClassStudent>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
