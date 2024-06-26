import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOService } from './minio.service';
import { minioFactory } from './minio.provider';
import { AttachmentEntity } from './attachments.entity';
import { AttachmentSizeEntity } from './attachment-sizes.entity';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentEntity, AttachmentSizeEntity])],
  providers: [AttachmentsService, MinIOService, minioFactory],
  controllers: [AttachmentsController],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
