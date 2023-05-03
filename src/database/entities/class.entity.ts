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
    public id: number;

    @Column('varchar')
    public semester: string;

    @Column('int')
    public classNumber: string;

    @Column('varchar', {
        nullable: true,
    })
    public schedule: string;

    @Column('varchar', {
        nullable: true,
    })
    public classroom: string;

    @Column('varchar', {
        nullable: true,
    })
    public joinCode: string;

    @Column('bool', {
        default: false,
    })
    public requirePermission: boolean;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @OneToMany(() => ClassTeacher, (classTeacher) => classTeacher.class, {
        cascade: true,
    })
    public classTeachers: ClassTeacher[];

    @OneToMany(() => ClassTeacher, (classStudent) => classStudent.class, {
        cascade: true,
    })
    public classStudents: ClassTeacher[];

    constructor(props?: Partial<Class>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
