import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '@/prima.service';
import { BrandsService } from '@/brands/brands.service';
import { CategoriesService } from '@/categories/categories.service';
import { GendersService } from '@/genders/genders.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PricesService } from '@/prices/prices.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly gendersService: GendersService,
    @Inject(forwardRef(() => PricesService))
    private readonly pricesService: PricesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.brandsService.findOne(createProductDto.brandId);

    const product = await this.prismaService.product.create({
      data: createProductDto,
    });

    this.pricesService.create(product.id, createProductDto, false);

    return product;
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prismaService.product.findFirst({
      where: { id },
    });

    if (!product) throw new NotFoundException('Produto não encontrado');

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (
      updateProductDto.brandId &&
      product.brandId !== updateProductDto.brandId
    ) {
      await this.brandsService.findOne(updateProductDto.brandId);
    }

    if (
      updateProductDto.categoryId &&
      updateProductDto.categoryId !== product.categoryId
    ) {
      await this.categoriesService.findOne(updateProductDto.categoryId);
    }

    if (
      updateProductDto.genderId &&
      updateProductDto.genderId !== product.genderId
    ) {
      await this.gendersService.findOne(updateProductDto.genderId);
    }

    return this.prismaService.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prismaService.product.delete({ where: { id } });
  }
}
