import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableStudentAnswersAddName1687190846093 implements MigrationInterface {
    name = 'UpdateTableStudentAnswersAddName1687190846093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quizzes\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`quizzes\` DROP COLUMN \`name\``);
    }

}
