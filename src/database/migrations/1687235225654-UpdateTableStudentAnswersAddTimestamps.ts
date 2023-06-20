import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableStudentAnswersAddTimestamps1687235225654 implements MigrationInterface {
    name = 'UpdateTableStudentAnswersAddTimestamps1687235225654';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_answers\` DROP COLUMN \`createdAt\`
        `);
    }
}
