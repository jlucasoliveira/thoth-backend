import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Prices } from '@prisma/client';
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { CreatePriceDto } from './dto/create-price.dto';
import { PricesService } from './prices.service';

@Controller('products/:productId/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() payload: CreatePriceDto,
  ) {
    return this.pricesService.create(productId, payload);
  }

  @Get()
  findAll(
    @Param('productId') productId: string,
    @Query('filter', FilterPipe) where: Filter<Prices>,
    @Query('sort', SortPipe) orderBy: OrderBy<Prices>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.pricesService.findAll(productId, {
      where,
      orderBy,
      skip,
      take,
    });
  }
}
