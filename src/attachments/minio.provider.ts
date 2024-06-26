import { Client } from 'minio';
import { MINIO_CONFIG } from '@/config/configuration';
import { Provider } from '@nestjs/common';

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
