import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { User } from '@/auth/guards/user.decorator';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { StockEntry } from '@prisma/client';

@Controller('products/:productId/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.stockService.create(productId, quantity);
  }

  @Post('entry')
  createEntry(
    @User() user: Express.User,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createStockDto: CreateStockEntryDto,
  ) {
    return this.stockService.createStockEntry(createStockDto, user, productId);
  }

  @Get('entries')
  findAllByProductId(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('filter', FilterPipe) where: Filter<StockEntry>,
    @Query('sort', SortPipe) orderBy: OrderBy<StockEntry>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.stockService.findByProductId(productId, {
      where,
      orderBy,
      skip,
      take,
    });
  }

  @Get(':id/entries')
  findAll(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('filter', FilterPipe) where: Filter<StockEntry>,
    @Query('sort', SortPipe) orderBy: OrderBy<StockEntry>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.stockService.findAllEntries(id, { where, orderBy, skip, take });
  }

  @Get()
  findOneByProductId(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.stockService.findOneByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stockService.findOne(id);
  }
}
