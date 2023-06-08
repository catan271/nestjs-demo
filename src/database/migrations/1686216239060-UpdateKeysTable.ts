import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKeysTable1686216239060 implements MigrationInterface {
    name = 'UpdateKeysTable1686216239060';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP FOREIGN KEY \`FK_e5be9d333384a94a1f3930093bb\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD UNIQUE INDEX \`IDX_e5be9d333384a94a1f3930093b\` (\`quizId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_e5be9d333384a94a1f3930093b\` ON \`keys\` (\`quizId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD CONSTRAINT \`FK_e5be9d333384a94a1f3930093bb\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP FOREIGN KEY \`FK_e5be9d333384a94a1f3930093bb\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_e5be9d333384a94a1f3930093b\` ON \`keys\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\` DROP INDEX \`IDX_e5be9d333384a94a1f3930093b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`keys\`
            ADD CONSTRAINT \`FK_e5be9d333384a94a1f3930093bb\` FOREIGN KEY (\`quizId\`) REFERENCES \`quizzes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
