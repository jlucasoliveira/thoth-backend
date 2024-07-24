import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  FilterPipe,
  IncludePipe,
  SortPipe,
} from '@/shared/pagination/filters.pipe';
import { OrderBy } from '@/shared/pagination/filters';
import { VariationsServices } from './variations.service';
import { ProductVariationEntity } from './variations.entity';

@Controller('variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsServices) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe)
    where: FindOptionsWhere<ProductVariationEntity>,
    @Query('sort', SortPipe) order: OrderBy<ProductVariationEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<ProductVariationEntity>,
  ) {
    return this.variationsService.findAll({
      order,
      skip,
      take,
      where,
      relations: { product: true, ...relations },
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include', IncludePipe)
    relations?: FindOptionsRelations<ProductVariationEntity>,
  ) {
    return this.variationsService.findOne(id, undefined, relations);
  }
}
