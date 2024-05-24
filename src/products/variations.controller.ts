import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { VariationsServices } from './variations.service';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { ProductVariation } from '@prisma/client';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { OrderBy } from '@/shared/pagination/filters';

@Controller('variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsServices) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<ProductVariation>,
    @Query('sort', SortPipe) orderBy: OrderBy<ProductVariation>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.variationsService.findAll({ orderBy, skip, take, where });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variationsService.findOne(id);
  }
}
