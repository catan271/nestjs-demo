import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableStudentAnswer1687163154887 implements MigrationInterface {
    name = 'UpdateTableStudentAnswer1687163154887';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP COLUMN \`studentId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP FOREIGN KEY \`FK_a524127fd662e874de3d138c408\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` CHANGE \`classStudentId\` \`classStudentId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD CONSTRAINT \`FK_a524127fd662e874de3d138c408\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP FOREIGN KEY \`FK_a524127fd662e874de3d138c408\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` CHANGE \`classStudentId\` \`classStudentId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD CONSTRAINT \`FK_a524127fd662e874de3d138c408\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD \`studentId\` int NOT NULL
        `);
    }
}
