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
import { Class } from './class.entity';
import { User } from './user.entity';

@Entity('class_teachers')
export class ClassTeacher extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    classId: number;

    @Column('int')
    userId: number;

    @Column('bool', {
        default: 0,
    })
    hidden: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Class, (_class) => _class.classTeachers, {
        onDelete: 'CASCADE',
    })
    class: Class;

    @ManyToOne(() => User, (user) => user.classTeachers, {
        onDelete: 'CASCADE',
    })
    user: User;

    constructor(props: Partial<ClassTeacher>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
