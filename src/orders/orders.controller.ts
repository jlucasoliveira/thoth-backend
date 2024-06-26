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
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { OrderBy } from '@/shared/pagination/filters';
import { OrderEntity } from './orders.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() payload: CreateOrderDTO) {
    return this.ordersService.create(payload);
  }

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<OrderEntity>,
    @Query('sort', SortPipe) order: OrderBy<OrderEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.ordersService.findAll({ order, skip, take, where });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payload: UpdateOrderDTO,
  ) {
    return this.ordersService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.delete(id);
  }
}
