import { Module } from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { MinIOService } from './minio.service';
import { AttachmentsService } from './attachments.service';
import { minioFactory } from './minio.provider';
import { AttachmentsController } from './attachments.controller';

@Module({
  providers: [AttachmentsService, MinIOService, PrismaService, minioFactory],
  exports: [AttachmentsService],
  controllers: [AttachmentsController],
})
export class AttachmentsModule {}
