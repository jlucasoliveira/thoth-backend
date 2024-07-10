import { registerAs } from '@nestjs/config';
import { asInt } from './helpers';

export const StorageConfigToken = 'storage-config';

export type StorageConfig = {
  endPoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  signed: {
    expires: number;
  };
};

export const storageConfig = registerAs<StorageConfig>(
  StorageConfigToken,
  () => ({
    endPoint: process.env.STORAGE_ENDPOINT_URL,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    bucket: process.env.STORAGE_BUCKET_NAME,
    signed: {
      expires: asInt(process.env.STORAGE_SIGNED_EXPIRES_IN, 5 * 60 * 1000),
    },
  }),
);
