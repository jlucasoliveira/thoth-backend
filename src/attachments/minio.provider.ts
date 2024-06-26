import { Client } from 'minio';
import { Provider } from '@nestjs/common';
import { MINIO_CONFIG } from '@/config/configuration';

export const MINIO_PROVIDER = 'MINIO';

export const minioFactory: Provider = {
  provide: MINIO_PROVIDER,
  useFactory: () =>
    new Client({
      endPoint: MINIO_CONFIG.endpointUrl,
      accessKey: MINIO_CONFIG.accessKey,
      secretKey: MINIO_CONFIG.secretKey,
    }),
};
