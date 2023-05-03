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
    public id: number;

    @Column('int')
    public classId: number;

    @Column('int')
    public studentId: number;

    @Column('bool', {
        default: false,
    })
    public hidden: boolean;

    @Column('bool', {
        default: false,
    })
    public waiting: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(() => Class, (_class) => _class.classStudents, {
        onDelete: 'CASCADE',
    })
    public class: Class;

    @ManyToOne(() => User, (user) => user.classStudents, {
        onDelete: 'CASCADE',
    })
    public user: User;

    constructor(props: Partial<ClassStudent>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
