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
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { User } from '@/auth/guards/user.decorator';
import {
  FilterPipe,
  IncludePipe,
  SortPipe,
} from '@/shared/pagination/filters.pipe';
import { OrderBy } from '@/shared/pagination/filters';
import { OrderEntity } from './orders.entity';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@User() seller: Express.User, @Body() payload: CreateOrderDTO) {
    return this.ordersService.create(seller, payload);
  }

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: FindOptionsWhere<OrderEntity>,
    @Query('sort', SortPipe) order: OrderBy<OrderEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<OrderEntity>,
  ) {
    return this.ordersService.findAll({ order, relations, skip, take, where });
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
