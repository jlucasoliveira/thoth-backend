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

const endpointPort = asInt(process.env.MINIO_ENDPOINT_PORT, 9000);

export const MINIO_CONFIG = {
  endpointPort,
  endpointUrl: process.env.MINIO_ENDPOINT_URL,
  useSSL: process.env.MINIO_ENDPOINT_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  bucket: process.env.MINIO_BUCKET_NAME,
  signed: {
    host: `${new URL(PUBLIC_URL).hostname}:${endpointPort}`,
    expires: asInt(process.env.MINIO_SIGNED_EXPIRES_IN, 5 * 60 * 1000),
  },
};
