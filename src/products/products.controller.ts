import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Product, ProductVariation } from '@prisma/client';
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';
import { VariationsServices } from './variations.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly variationsService: VariationsServices,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post(':productId/variations')
  createVariation(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() payload: CreateProductVariationDTO,
  ) {
    return this.variationsService.create(productId, [payload]);
  }

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<Product>,
    @Query('sort', SortPipe) orderBy: OrderBy<Product>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.productsService.findAll({ orderBy, skip, take, where });
  }

  @Get(':productId/variations')
  findAllVariations(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query('filter', FilterPipe) where: Filter<ProductVariation>,
    @Query('sort', SortPipe) orderBy: OrderBy<ProductVariation>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    where.productId = productId;
    return this.variationsService.findAll({
      orderBy,
      skip,
      take,
      where,
    });
  }

  @Get(':productId/variations/:id')
  findOneVariation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.variationsService.findOne(id, productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':productId/variations/:id')
  updateVariation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() payload: UpdateProductVariationDTO,
  ) {
    return this.variationsService.update(id, productId, payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':productId/variations/:id')
  deleteVariation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.deleteVariation(id, productId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
