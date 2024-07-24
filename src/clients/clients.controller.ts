import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { OrderBy } from '@/shared/pagination/filters';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { ClientEntity } from './clients.entity';
import { ClientsService } from './clients.service';
import { UpdateClientDTO } from './dto/update-client.dto';
import { CreateClientDTO } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: FindOptionsWhere<ClientEntity>,
    @Query('sort', SortPipe) order: OrderBy<ClientEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.clientService.findAll({ order, skip, take, where });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateClientDTO) {
    return this.clientService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateClientDTO,
  ) {
    return this.clientService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.delete(id);
  }
}
