import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Prisma, ProductVariation } from '@prisma/client';
import {
  FilterPipe,
  IncludePipe,
  SortPipe,
} from '@/shared/pagination/filters.pipe';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { OrderBy } from '@/shared/pagination/filters';
import { VariationsServices } from './variations.service';

@Controller('variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsServices) {}

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<ProductVariation>,
    @Query('sort', SortPipe) orderBy: OrderBy<ProductVariation>,
    @Query('include', IncludePipe) include?: Prisma.ProductVariationInclude,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.variationsService.findAll(
      { orderBy, skip, take, where },
      { product: true, ...include },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variationsService.findOne(id);
  }
}
