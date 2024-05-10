import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { Attachment, AttachmentSize, SizeKind } from '@prisma/client';
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { CreateAttachmentDTO } from './dto/create-attachment.dto';
import { AttachmentsService } from './attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<Attachment>,
    @Query('sort', SortPipe) orderBy: OrderBy<Attachment>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.attachmentService.findAll({ orderBy, skip, take, where });
  }

  @Get(':attachmentId/sizes')
  findAllSizes(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Query('filter', FilterPipe) where: Filter<AttachmentSize>,
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
    @Query('sort', new DefaultValuePipe('-size'), SortPipe)
    orderBy?: OrderBy<AttachmentSize>,
  ) {
    return this.attachmentService.findOne(id, size, orderBy);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateAttachmentDTO,
  ) {
    return this.attachmentService.upload(file, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.attachmentService.delete(id);
  }
}
