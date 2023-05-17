import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUsersTable1684312399762 implements MigrationInterface {
    name = 'UpdateUsersTable1684312399762';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`studentNumber\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`studentNumber\`
        `);
    }
}
