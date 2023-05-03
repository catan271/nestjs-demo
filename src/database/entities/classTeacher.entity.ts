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
    public id: number;

    @Column('int')
    public classId: number;

    @Column('int')
    public studentId: number;

    @Column('bool', {
        default: 0,
    })
    public hidden: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(() => Class, (_class) => _class.classTeachers, {
        onDelete: 'CASCADE',
    })
    public class: Class;

    @ManyToOne(() => User, (user) => user.classTeachers, {
        onDelete: 'CASCADE',
    })
    public user: User;

    constructor(props: Partial<ClassTeacher>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
