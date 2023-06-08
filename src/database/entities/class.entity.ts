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
import { Quiz } from './quiz.entity';

@Entity('classes')
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('text', {
        nullable: true,
    })
    description: string;

    @Column('varchar', {
        unique: true,
        length: 6,
    })
    classNumber: string;

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

    @OneToMany(() => Quiz, (quiz) => quiz.class, {
        cascade: true,
    })
    quizzes: Quiz[];

    constructor(props?: Partial<Class>) {
        super();
        Object.assign(this, props);
    }

    toJSON() {
        return instanceToInstance(this);
    }
}
