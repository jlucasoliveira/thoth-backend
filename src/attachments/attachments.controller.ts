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
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { SizeKind } from '@/types/size-kind';
import { AttachmentEntity } from './attachments.entity';
import { AttachmentSizeEntity } from './attachment-sizes.entity';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDTO } from './dto/create-attachment.dto';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<AttachmentEntity>,
    @Query('sort', SortPipe) order: OrderBy<AttachmentEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.attachmentService.findAll({ order, skip, take, where });
  }

  @Get(':attachmentId/sizes')
  findAllSizes(
    @Param('attachmentId', ParseUUIDPipe) attachmentId: string,
    @Query('filter', FilterPipe) where: Filter<AttachmentSizeEntity>,
    @Query('sort', SortPipe) order: OrderBy<AttachmentSizeEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.attachmentService.findAllSizes(attachmentId, {
      order,
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
    order?: OrderBy<AttachmentSizeEntity>,
  ) {
    return this.attachmentService.findOne(id, size, order);
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
