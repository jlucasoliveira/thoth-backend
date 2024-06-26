import { Client } from 'minio';
import { extname, join } from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import { MINIO_CONFIG } from '@/config/configuration';
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
  ) {}

  async getSignedURL(key: string) {
    return await this.minio.presignedUrl(
      'GET',
      MINIO_CONFIG.bucket,
      key,
      MINIO_CONFIG.signed.expires,
    );
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
    const { filename: name, basename } = this.uniqueFilename(
      attachment,
      filename,
      sfx,
    );
    const path = this.createFolderName(resource, basename, name);

    await this.minio.putObject(MINIO_CONFIG.bucket, path, file);

    return path;
  }

  async deleteFiles(keys: string[]) {
    return await this.minio.removeObjects(MINIO_CONFIG.bucket, keys);
  }
}
