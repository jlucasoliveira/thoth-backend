import { join } from 'node:path';

function asInt(value?: string, defaultValue?: number): number {
  if (value === undefined && defaultValue === undefined)
    throw new Error(`You must provide a valid value or a valid default value`);

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) return defaultValue;

  return parsed;
}

export const NODE_ENV = process.env.NODE_ENV;

export const PUBLIC_URL = process.env.PUBLIC_URL;

export const PORT = asInt(process.env.PORT, 3000);

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expireIn: process.env.JWT_EXPIRE_IN ?? '30d',
};

export const SENTRY_CONFIG = {
  dsn: process.env.SENTRY_DSN,
  isEnabled: NODE_ENV === 'production',
};

export const MINIO_CONFIG = {
  endpointUrl: process.env.MINIO_ENDPOINT_URL,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucket: process.env.MINIO_BUCKET_NAME,
  signed: {
    expires: asInt(process.env.MINIO_SIGNED_EXPIRES_IN, 5 * 60 * 1000),
  },
};

export const ORACLE_CONFIG = {
  type: 'oracle',
  isDebug: process.env.ORACLE_LOG_QUERY === 'true',
  host: process.env.ORACLE_HOST,
  port: asInt(process.env.ORACLE_PORT, 1521),
  database: process.env.ORACLE_DATABASE,
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  walletPassword: process.env.ORACLE_WALLET_PASSWORD,
  walletPath: join(__dirname, '..', '..', 'oracle-certificates'),
  entitiesPath: join(__dirname, '..', '**', '*.entity.{ts,js}'),
  migrationsPath: join(__dirname, '..', '..', 'migrations', '*.{ts,js}'),
};
