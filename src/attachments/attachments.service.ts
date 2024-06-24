import sharp from 'sharp';
import { sync as getImageSize } from 'probe-image-size';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Attachment, AttachmentSize, SizeKind } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { Transaction } from '@/@types/prisma';
import { isImage } from '@/utils/isImage';
import { MinIOService } from './minio.service';
import { CreateAttachmentDTO } from './dto/create-attachment.dto';

enum SizeResolution {
  XS = 50,
  S = 100,
  MD = 250,
  L = 350,
  XL = 500,
}

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly minioService: MinIOService,
    private readonly prismaService: PrismaService,
  ) {}

  async findAll(props: PageOptions<Attachment>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.attachment.findMany(props),
      this.prismaService.attachment.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findAllSizes(attachmentId: string, props: PageOptions<AttachmentSize>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.attachmentSize.findMany({
        ...props,
        where: { ...props.where, attachmentId },
      }),
      this.prismaService.attachmentSize.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(
    attachmentId: string,
    size?: SizeKind,
    orderBy?: PageOptions<AttachmentSize>['orderBy'],
  ) {
    const attachment = await this.prismaService.attachmentSize.findFirst({
      where: { attachmentId, size },
      orderBy,
    });

    if (!attachment) throw new NotFoundException('Anexo não encontrado');

    const signedURL = await this.minioService.getSignedURL(attachment.key);

    return { ...attachment, url: signedURL };
  }

  async delete(id: string) {
    const sizes = await this.prismaService.attachmentSize.findMany({
      where: { attachmentId: id },
      select: { key: true },
    });

    await this.minioService.deleteFiles(sizes.map((size) => size.key));

    await this.prismaService.attachmentSize.deleteMany({
      where: { attachmentId: id },
    });

    await this.prismaService.attachment.delete({ where: { id } });
  }

  private async resizeImage(file: Express.Multer.File) {
    const dimensions = getImageSize(file.buffer);
    const dimensionKeyword =
      dimensions.width > dimensions.height ? 'width' : 'height';

    return await Promise.all(
      Object.values(SizeKind).map(async (size) => {
        const sz = SizeResolution[size];
        const image = await sharp(file.buffer)
          .resize({ [dimensionKeyword]: sz })
          .toBuffer();

        return { image, size };
      }),
    );
  }

  async createHash(file: Buffer) {
    const { rgbaToThumbHash } = await import('thumbhash');

    const IMAGE_SIZE = 100;
    const { data, info } = await sharp(file)
      .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'contain' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const hash = rgbaToThumbHash(info.width, info.height, data);

    return Buffer.from(hash).toString('base64');
  }

  private async createAttachment(
    transaction: Transaction,
    file: Express.Multer.File,
    payload: Omit<CreateAttachmentDTO, 'resource'>,
  ) {
    const hash = await this.createHash(file.buffer);
    return await transaction.attachment.create({ data: { hash, ...payload } });
  }

  private async uploadImages(
    attachment: Attachment,
    transaction: Transaction,
    file: Express.Multer.File,
    resource?: string,
  ) {
    const images = await this.resizeImage(file);
    const { filename, basename } = this.minioService.uniqueFilename(
      attachment,
      file.originalname,
    );

    try {
      const sizes = await Promise.all(
        images.map(async ({ image, size }) => {
          const key = await this.minioService.putFile(
            attachment,
            image,
            file.originalname,
            resource,
            size,
          );

          return { attachmentId: attachment.id, key, size };
        }),
      );

      await transaction.attachment.update({
        where: { id: attachment.id },
        data: { key: filename },
      });

      return await transaction.attachmentSize.createMany({
        data: sizes,
      });
    } catch (error) {
      await this.minioService.deleteFiles(
        images.map(({ size }) => {
          const name = this.minioService.uniqueFilename(
            attachment,
            file.originalname,
            size,
          ).filename;

          return this.minioService.createFolderName(resource, basename, name);
        }),
      );
      throw error;
    }
  }

  private async uploadFile(
    attachment: Attachment,
    transaction: Transaction,
    file: Express.Multer.File,
    resource?: string,
  ) {
    const key = await this.minioService.putFile(
      attachment,
      file.buffer,
      file.originalname,
      resource,
    );

    await transaction.attachment.update({
      where: { id: attachment.id },
      data: { key },
    });

    return await transaction.attachmentSize.createMany({
      data: { key, size: SizeKind.MD, attachmentId: attachment.id },
    });
  }

  private async _upload(
    transaction: Transaction,
    file: Express.Multer.File,
    { resource, ...payload }: CreateAttachmentDTO,
  ) {
    const attachment = await this.createAttachment(transaction, file, payload);

    if (isImage(file.originalname)) {
      await this.uploadImages(attachment, transaction, file, resource);
    } else {
      await this.uploadFile(attachment, transaction, file, resource);
    }

    return await transaction.attachment.findFirst({
      where: { id: attachment.id },
    });
  }

  async upload(file: Express.Multer.File, payload: CreateAttachmentDTO) {
    return await this.prismaService.$transaction((tx) =>
      this._upload(tx, file, payload),
    );
  }
}
