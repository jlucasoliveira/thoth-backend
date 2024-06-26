import sharp from 'sharp';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { sync as getImageSize } from 'probe-image-size';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { isImage } from '@/utils/isImage';
import { SizeKind } from '@/types/size-kind';
import { AttachmentSizeEntity } from './attachment-sizes.entity';
import { AttachmentEntity } from './attachments.entity';
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
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepository: Repository<AttachmentEntity>,
    @InjectRepository(AttachmentSizeEntity)
    private readonly attachmentSizeRepository: Repository<AttachmentSizeEntity>,
    private readonly minioService: MinIOService,
  ) {}

  async findAll(props: PageOptions<AttachmentEntity>) {
    const [data, total] = await this.attachmentRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findAllSizes(
    attachmentId: string,
    props: PageOptions<AttachmentSizeEntity>,
  ) {
    const [data, total] = await this.attachmentSizeRepository.findAndCount({
      ...props,
      where: { ...props.where, attachmentId },
    });

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(
    attachmentId: string,
    size?: SizeKind,
    order?: PageOptions<AttachmentSizeEntity>['order'],
  ) {
    const attachment = await this.attachmentSizeRepository.findOne({
      where: { attachmentId, size },
      order,
    });

    if (!attachment) throw new NotFoundException('Anexo não encontrado');

    const signedURL = await this.minioService.getSignedURL(attachment.key);

    return { ...attachment, url: signedURL };
  }

  async delete(id: string) {
    const sizes = await this.attachmentSizeRepository.find({
      where: { attachmentId: id },
      select: { key: true },
    });

    await this.attachmentRepository.manager.transaction(async (tx) => {
      await this.minioService.deleteFiles(sizes.map((size) => size.key));

      await tx.getRepository(AttachmentSizeEntity).delete({ attachmentId: id });

      await tx.getRepository(AttachmentEntity).delete(id);
    });
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
    transaction: EntityManager,
    file: Express.Multer.File,
    payload: Omit<CreateAttachmentDTO, 'resource'>,
  ) {
    const hash = await this.createHash(file.buffer);
    const attachmentRepository = transaction.getRepository(AttachmentEntity);

    return await attachmentRepository.save(
      attachmentRepository.create({ hash, ...payload }),
    );
  }

  private async uploadImages(
    attachment: AttachmentEntity,
    tx: EntityManager,
    file: Express.Multer.File,
    resource = 'content',
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

      await tx
        .getRepository(AttachmentEntity)
        .update(attachment.id, { key: filename });

      const attachmentSizeRepository = tx.getRepository(AttachmentSizeEntity);

      return await attachmentSizeRepository.save(
        attachmentSizeRepository.create(sizes),
      );
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
    attachment: AttachmentEntity,
    tx: EntityManager,
    file: Express.Multer.File,
    resource?: string,
  ) {
    const key = await this.minioService.putFile(
      attachment,
      file.buffer,
      file.originalname,
      resource,
    );

    await tx.getRepository(AttachmentEntity).update(attachment.id, { key });

    const attachmentSizeRepository = tx.getRepository(AttachmentSizeEntity);

    return await attachmentSizeRepository.save(
      attachmentSizeRepository.create({
        key,
        size: SizeKind.MD,
        attachmentId: attachment.id,
      }),
    );
  }

  private async _upload(
    tx: EntityManager,
    file: Express.Multer.File,
    { resource, ...payload }: CreateAttachmentDTO,
  ) {
    const attachment = await this.createAttachment(tx, file, payload);

    if (isImage(file.originalname)) {
      await this.uploadImages(attachment, tx, file, resource);
    } else {
      await this.uploadFile(attachment, tx, file, resource);
    }

    return await tx.getRepository(AttachmentEntity).findOne({
      where: { id: attachment.id },
    });
  }

  async upload(file: Express.Multer.File, payload: CreateAttachmentDTO) {
    return await this.attachmentRepository.manager.transaction((tx) =>
      this._upload(tx, file, payload),
    );
  }
}
