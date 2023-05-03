import { Exclude, instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
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
    public id: number;

    @Column('varchar', {
        unique: true,
    })
    public email: string;

    @Column('varchar')
    @Exclude()
    public password: string;

    @Column('varchar')
    public familyName: string;

    @Column('varchar')
    public givenName: string;

    @Column('varchar', {
        length: 15,
        nullable: true,
    })
    public mobile: string;

    @Column('tinyint', {
        default: accountStatus.ACTIVE.value,
    })
    public status: number;

    @Column('tinyint')
    public role: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @OneToMany(() => ClassTeacher, (classTeacher) => classTeacher.user, {
        cascade: true,
    })
    public classTeachers: ClassTeacher[];

    @OneToMany(() => ClassTeacher, (classStudent) => classStudent.user, {
        cascade: true,
    })
    public classStudents: ClassTeacher[];

    constructor(props?: Partial<User>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
