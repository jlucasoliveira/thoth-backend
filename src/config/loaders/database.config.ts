import { join } from 'node:path';
import { registerAs } from '@nestjs/config';
import { asInt } from './helpers';

export const DatabaseConfigToken = 'database-config';

export type DatabaseConfig = {
  isDebug: boolean;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  connectString: string;
  walletPassword: string;
  walletPath: string;
  entitiesPath: string;
  migrationsPath: string;
};

export const databaseConfig = registerAs<DatabaseConfig>(
  DatabaseConfigToken,
  () => ({
    isDebug: process.env.DB_LOG_QUERY === 'true',
    host: process.env.DB_HOST,
    port: asInt(process.env.DB_PORT, 1521),
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    walletPassword: process.env.DB_WALLET_PASSWORD,
    walletPath: process.env.DB_WALLET_PATH,
    entitiesPath: join(__dirname, '..', '..', '**', '*.entity.{ts,js}'),
    // eslint-disable-next-line prettier/prettier
    migrationsPath: join(__dirname, '..', '..', '..', 'migrations', '*.{ts,js}'),
  }),
);
