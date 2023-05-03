import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabase1683134052704 implements MigrationInterface {
    name = 'InitialDatabase1683134052704';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`classes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`semester\` varchar(255) NOT NULL,
                \`classNumber\` int NOT NULL,
                \`schedule\` varchar(255) NULL,
                \`classroom\` varchar(255) NULL,
                \`joinCode\` varchar(255) NULL,
                \`requirePermission\` tinyint NOT NULL DEFAULT 0,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`class_teachers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classId\` int NOT NULL,
                \`studentId\` int NOT NULL,
                \`hidden\` tinyint NOT NULL DEFAULT '0',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`familyName\` varchar(255) NOT NULL,
                \`givenName\` varchar(255) NOT NULL,
                \`mobile\` varchar(15) NULL,
                \`status\` tinyint NOT NULL DEFAULT '1',
                \`role\` tinyint NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`class_students\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`classId\` int NOT NULL,
                \`studentId\` int NOT NULL,
                \`hidden\` tinyint NOT NULL DEFAULT 0,
                \`waiting\` tinyint NOT NULL DEFAULT 0,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\`
            ADD CONSTRAINT \`FK_ec9a523c3c379160292fde41a59\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\`
            ADD CONSTRAINT \`FK_31f622801adcfdae2e6eb14e755\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_students\`
            ADD CONSTRAINT \`FK_8077e3550bf215749c0cdd138c2\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE \`class_students\` DROP FOREIGN KEY \`FK_8077e3550bf215749c0cdd138c2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` DROP FOREIGN KEY \`FK_31f622801adcfdae2e6eb14e755\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`class_teachers\` DROP FOREIGN KEY \`FK_ec9a523c3c379160292fde41a59\`
        `);
        await queryRunner.query(`
            DROP TABLE \`class_students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`class_teachers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`classes\`
        `);
    }
}
