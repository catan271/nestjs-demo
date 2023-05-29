import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateClass1685378749666 implements MigrationInterface {
    name = 'UpdateClass1685378749666';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`classroom\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`joinCode\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`schedule\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`semester\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` DROP COLUMN \`studentId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\` DROP COLUMN \`studentId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`name\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`description\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`classNumber\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`classNumber\` varchar(6) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD UNIQUE INDEX \`IDX_868f8c9b6a90d49c4c155bf97d\` (\`classNumber\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` DROP FOREIGN KEY \`FK_31f622801adcfdae2e6eb14e755\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` CHANGE \`userId\` \`userId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_bb6d98b93962a088d438100feb3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\` CHANGE \`userId\` \`userId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\`
            ADD CONSTRAINT \`FK_31f622801adcfdae2e6eb14e755\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\`
            ADD CONSTRAINT \`FK_bb6d98b93962a088d438100feb3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_bb6d98b93962a088d438100feb3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` DROP FOREIGN KEY \`FK_31f622801adcfdae2e6eb14e755\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\` CHANGE \`userId\` \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\`
            ADD CONSTRAINT \`FK_bb6d98b93962a088d438100feb3\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` CHANGE \`userId\` \`userId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\`
            ADD CONSTRAINT \`FK_31f622801adcfdae2e6eb14e755\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP INDEX \`IDX_868f8c9b6a90d49c4c155bf97d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`classNumber\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`classNumber\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`description\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\` DROP COLUMN \`name\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\`
            ADD \`studentId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\`
            ADD \`studentId\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`semester\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`schedule\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`joinCode\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`classes\`
            ADD \`classroom\` varchar(255) NULL
        `);
    }
}
