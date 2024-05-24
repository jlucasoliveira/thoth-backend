import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { BrandsService } from '@/brands/brands.service';
import { CategoriesService } from '@/categories/categories.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { VariationsServices } from './variations.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly variationsService: VariationsServices,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { variations, ...data } = createProductDto;
    await this.brandsService.findOne(data.brandId);
    await this.categoriesService.findOne(data.categoryId);

    return await this.prismaService.$transaction(async (tx) => {
      const product = await tx.product.create({ data });
      if (variations?.length)
        await this.variationsService.create(product.id, variations, tx);

      return product;
    });
  }

  async findAll(props: PageOptions<Product>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany(props),
      this.prismaService.product.count(props),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
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
