import { Client } from 'minio';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig, StorageConfigToken } from '@/config';

export const MINIO_PROVIDER = 'MINIO';

export const minioFactory: Provider = {
  provide: MINIO_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const { endPoint, accessKey, secretKey } =
      configService.getOrThrow<StorageConfig>(StorageConfigToken);
    return new Client({ endPoint, accessKey, secretKey });
  },
};
