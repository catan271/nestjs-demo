import { join } from 'path';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as mysql2 from 'mysql2';

config();

export const options: MysqlConnectionOptions = {
    type: 'mysql',
    driver: mysql2,
    synchronize: false,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, '/entities/*{.ts,.js}')],
    migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
    logging: process.env.MODE === 'development',
};

const dataSource = new DataSource(options);
dataSource.initialize();

export default dataSource;
