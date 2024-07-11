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
import { User } from '@/auth/guards/user.decorator';
import { OrderBy } from '@/shared/pagination/filters';
import { Filter } from '@/shared/pagination/pageOptions.dto';
import { FilterPipe, SortPipe } from '@/shared/pagination/filters.pipe';
import { ProductsService } from './products.service';
import { VariationsServices } from './variations.service';
import { ProductEntity } from './products.entity';
import { ProductVariationEntity } from './variations.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly variationsService: VariationsServices,
  ) {}

  @Post()
  create(
    @User() user: Express.User,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(user, createProductDto);
  }

  @Post(':productId/variations')
  createVariation(
    @User() user: Express.User,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() payload: CreateProductVariationDTO,
  ) {
    return this.variationsService.create(user, productId, [payload]);
  }

  @Get()
  findAll(
    @Query('filter', FilterPipe) where: Filter<ProductEntity>,
    @Query('sort', SortPipe) order: OrderBy<ProductEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    return this.productsService.findAll({ order, skip, take, where });
  }

  @Get(':productId/variations')
  findAllVariations(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('filter', FilterPipe) where: Filter<ProductVariationEntity>,
    @Query('sort', SortPipe) order: OrderBy<ProductVariationEntity>,
    @Query('skip', new ParseIntPipe({ optional: true })) skip: number = 0,
    @Query('take', new ParseIntPipe({ optional: true })) take: number = 10,
  ) {
    where.productId = productId;
    return this.variationsService.findAll({
      order,
      skip,
      take,
      where,
    });
  }

  @Get(':productId/variations/:id')
  findOneVariation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.variationsService.findOne(id, productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':productId/variations/:id')
  updateVariation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() payload: UpdateProductVariationDTO,
  ) {
    return this.variationsService.update(id, payload, productId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':productId/variations/:id')
  deleteVariation(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.variationsService.remove(id, productId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
