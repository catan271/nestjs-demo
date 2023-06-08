import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizModule1686194565256 implements MigrationInterface {
    name = 'QuizModule1686194565256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`keys\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`quizId\` int NOT NULL,
                \`keys\` json NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`quizzes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classId\` int NOT NULL,
                \`position\` json NULL,
                \`shuffled\` tinyint NOT NULL DEFAULT 0,
                \`closeTime\` timestamp NULL,
                \`open\` tinyint NOT NULL DEFAULT 1,
                \`questions\` json NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD CONSTRAINT \`FK_e5be9d333384a94a1f3930093bb\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`quizzes\`
            ADD CONSTRAINT \`FK_ad50f2ee4661df22461a8f2594e\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quizzes\` DROP FOREIGN KEY \`FK_ad50f2ee4661df22461a8f2594e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP FOREIGN KEY \`FK_e5be9d333384a94a1f3930093bb\`
        `);
        await queryRunner.query(`
            DROP TABLE \`quizzes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`keys\`
        `);
    }

}
