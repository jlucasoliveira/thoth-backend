import { Client } from 'minio';
import { extname, join } from 'node:path';
import { Inject, Injectable } from '@nestjs/common';
import { MINIO_CONFIG } from '@/config/configuration';
import { MINIO_PROVIDER } from './minio.provider';
import { Attachment } from '@prisma/client';

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
      {},
      new Date(),
      MINIO_CONFIG.signed.host,
    );
  }

  createFolderName(resource: string, folder: string, filename?: string) {
    const args = [resource, folder];

    if (filename && filename.length > 0) args.push(filename);

    return join('assets', ...args);
  }

  uniqueFilename(
    attachment: Attachment,
    filename: string,
    sfx?: string,
  ): [string, string] {
    const ext = extname(filename);

    const [file] = filename.split(ext);
    const name = file + attachment.id;

    return [name + sfx + ext, name];
  }

  async putFile(
    attachment: Attachment,
    file: Buffer,
    filename: string,
    resource = 'content',
    sfx?: string,
  ) {
    const [_filename, name] = this.uniqueFilename(attachment, filename, sfx);
    const path = this.createFolderName(resource, name, _filename);

    await this.minio.putObject(MINIO_CONFIG.bucket, path, file);

    return path;
  }

  async deleteFiles(keys: string[]) {
    return await this.minio.removeObjects(MINIO_CONFIG.bucket, keys);
  }
}
