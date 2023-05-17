import { instanceToInstance } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ClassTeacher } from './classTeacher.entity';

@Entity('classes')
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    semester: string;

    @Column('int')
    classNumber: number;

    @Column('varchar', {
        nullable: true,
    })
    schedule: string;

    @Column('varchar', {
        nullable: true,
    })
    classroom: string;

    @Column('varchar', {
        nullable: true,
    })
    joinCode: string;

    @Column('bool', {
        default: false,
    })
    requirePermission: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ClassTeacher, (classTeacher) => classTeacher.class, {
        cascade: true,
    })
    classTeachers: ClassTeacher[];

    @OneToMany(() => ClassTeacher, (classStudent) => classStudent.class, {
        cascade: true,
    })
    classStudents: ClassTeacher[];

    constructor(props?: Partial<Class>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
