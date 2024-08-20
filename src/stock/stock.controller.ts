import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import {
  FilterPipe,
  IncludePipe,
  SortPipe,
} from '@/shared/pagination/filters.pipe';
import { User } from '@/auth/guards/user.decorator';
import { OrderBy } from '@/shared/pagination/filters';
import { StockEntryEntity } from './stock-entries.entity';
import { StockService } from './stock.service';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { UpdateStockDTO } from './dto/update-stock.dto';

@Controller(['stock', 'variations/:variationId/stock'])
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(
    @Param('variationId', ParseUUIDPipe) variationId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.stockService.create(variationId, quantity);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateStockDTO) {
    return this.stockService.update(id, data);
  }

  @Post('entry')
  createEntry(
    @User() user: Express.User,
    @Param('variationId', ParseUUIDPipe) variationId: string,
    @Body() createStockDto: CreateStockEntryDto,
  ) {
    return this.stockService.createStockEntry(
      createStockDto,
      user,
      variationId,
    );
  }

  @Get('entries')
  findAllByProductId(
    @Param('variationId', ParseUUIDPipe) variationId: string,
    @Query('filter', FilterPipe) where: FindOptionsWhere<StockEntryEntity>,
    @Query('sort', SortPipe) order: OrderBy<StockEntryEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<StockEntryEntity>,
  ) {
    return this.stockService.findByProductId(variationId, {
      where,
      order,
      skip,
      take,
      relations,
    });
  }

  @Get(':id/entries')
  findAll(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('filter', FilterPipe) where: FindOptionsWhere<StockEntryEntity>,
    @Query('sort', SortPipe) order: OrderBy<StockEntryEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<StockEntryEntity>,
  ) {
    return this.stockService.findAllEntries(id, {
      where,
      order,
      skip,
      take,
      relations,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stockService.findOne(id);
  }

  @Get()
  findOneByProductId(@Param('variationId', ParseUUIDPipe) variationId: string) {
    return this.stockService.findOneByProductId(variationId);
  }

  @Delete('entries/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.stockService.delete(id);
  }
}
