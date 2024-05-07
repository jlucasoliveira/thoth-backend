import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { OrderBy } from '@/shared/pagination/filters';
import { Attachment, AttachmentSize, SizeKind } from '@prisma/client';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Get()
  findAll(
    @Query('filters', FilterPipe) where: Filter<Attachment>,
    @Query('sort', SortPipe) orderBy: OrderBy<Attachment>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.attachmentService.findAll({ orderBy, skip, take, where });
  }

  @Get(':attachmentId/sizes')
  findAllSizes(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Query('filters', FilterPipe) where: Filter<AttachmentSize>,
    @Query('sort', SortPipe) orderBy: OrderBy<AttachmentSize>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.attachmentService.findAllSizes(attachmentId, {
      orderBy,
      skip,
      take,
      where,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('size') size?: SizeKind,
  ) {
    return this.attachmentService.findOne(id, size);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('resource') resource?: string,
  ) {
    return this.attachmentService.upload(file, resource);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.attachmentService.delete(id);
  }
}
