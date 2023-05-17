import { Exclude, instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { accountStatus } from '../../constants/accountStatus.constant';
import { ClassTeacher } from './classTeacher.entity';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {
        unique: true,
    })
    email: string;

    @Column('varchar')
    @Exclude()
    password: string;

    @Column('varchar')
    familyName: string;

    @Column('varchar')
    givenName: string;

    @Column('varchar', {
        length: 15,
        nullable: true,
    })
    mobile: string;

    @Column('tinyint', {
        default: accountStatus.ACTIVE.value,
    })
    status: number;

    @Column('tinyint')
    role: number;

    @Column('varchar')
    studentNumber: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany(() => ClassTeacher, (classTeacher) => classTeacher.user, {
        cascade: true,
    })
    classTeachers: ClassTeacher[];

    @OneToMany(() => ClassTeacher, (classStudent) => classStudent.user, {
        cascade: true,
    })
    classStudents: ClassTeacher[];

    constructor(props?: Partial<User>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
