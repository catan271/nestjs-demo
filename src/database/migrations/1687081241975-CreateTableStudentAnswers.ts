import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableStudentAnswers1687081241975 implements MigrationInterface {
    name = 'CreateTableStudentAnswers1687081241975';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_e5be9d333384a94a1f3930093b\` ON \`keys\`
        `);
        await queryRunner.query(`
            CREATE TABLE \`student_answers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`studentId\` int NOT NULL,
                \`quizId\` int NOT NULL,
                \`position\` json NOT NULL,
                \`answers\` json NOT NULL,
                \`correct\` int NULL,
                \`total\` int NULL,
                \`classStudentId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD CONSTRAINT \`FK_a524127fd662e874de3d138c408\` FOREIGN KEY (\`classStudentId\`) REFERENCES \`class_students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD CONSTRAINT \`FK_87741f222c7957eaed12a551b41\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP FOREIGN KEY \`FK_87741f222c7957eaed12a551b41\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP FOREIGN KEY \`FK_a524127fd662e874de3d138c408\`
        `);
        await queryRunner.query(`
            DROP TABLE \`student_answers\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_e5be9d333384a94a1f3930093b\` ON \`keys\` (\`quizId\`)
        `);
    }
}
