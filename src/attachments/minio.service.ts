import { extname, join } from 'node:path';
import { Client } from 'minio';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig, StorageConfigToken } from '@/config';
import { AttachmentEntity } from './attachments.entity';
import { MINIO_PROVIDER } from './minio.provider';

type UniqueFileName = {
  filename: string;
  basename: string;
};

@Injectable()
export class MinIOService {
  constructor(
    @Inject(MINIO_PROVIDER)
    private readonly minio: Client,
    private readonly configService: ConfigService,
  ) {}

  async getSignedURL(key: string) {
    const { bucket, signed } =
      this.configService.getOrThrow<StorageConfig>(StorageConfigToken);

    return await this.minio.presignedUrl('GET', bucket, key, signed.expires);
  }

  createFolderName(resource: string, folder: string, filename?: string) {
    const resources = resource.split('.');
    resources.push(folder);

    if (filename && filename.length > 0) resources.push(filename);

    return join('assets', ...resources);
  }

  uniqueFilename(
    attachment: AttachmentEntity,
    filename: string,
    sfx?: string,
  ): UniqueFileName {
    const ext = extname(filename);

    const basename = attachment.id;

    return {
      basename,
      filename: basename + (sfx ?? '') + ext,
    };
  }

  async putFile(
    attachment: AttachmentEntity,
    file: Buffer,
    filename: string,
    resource = 'content',
    sfx?: string,
  ) {
    const { bucket } =
      this.configService.getOrThrow<StorageConfig>(StorageConfigToken);

    const { filename: name, basename } = this.uniqueFilename(
      attachment,
      filename,
      sfx,
    );
    const path = this.createFolderName(resource, basename, name);

    await this.minio.putObject(bucket, path, file);

    return path;
  }

  async deleteFiles(keys: string[]) {
    const { bucket } =
      this.configService.getOrThrow<StorageConfig>(StorageConfigToken);

    return await this.minio.removeObjects(bucket, keys);
  }
}
