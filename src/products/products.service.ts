import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariation } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { BrandsService } from '@/brands/brands.service';
import { CategoriesService } from '@/categories/categories.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { Transaction } from '@/types/prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { variations, ...data } = createProductDto;
    await this.brandsService.findOne(data.brandId);
    await this.categoriesService.findOne(data.categoryId);

    return await this.prismaService.$transaction(async (tx) => {
      const product = await tx.product.create({ data });
      await this.createVariation(product.id, variations, tx);

      return product;
    });
  }

  async createVariation(
    productId: string,
    payloads: Array<CreateProductVariationDTO>,
    tx?: Transaction,
  ) {
    const service = tx ?? this.prismaService;

    return await service.productVariation.createMany({
      data: payloads.map((payload) => ({
        ...payload,
        productId,
      })),
    });
  }

  async findAll(props: PageOptions<ProductVariation>) {
    const selector = {
      ...props,
      include: { product: true },
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productVariation.findMany(selector),
      this.prismaService.productVariation.count(),
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

  async findOneVariation(id: string, productId: string) {
    const variation = await this.prismaService.productVariation.findFirst({
      where: { id, productId },
    });

    if (!variation) throw new NotFoundException('Variação não encontrada');

    return variation;
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

  async updateVariation(
    id: string,
    productId: string,
    payload: UpdateProductVariationDTO,
  ) {
    await this.findOneVariation(id, productId);

    return this.prismaService.productVariation.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prismaService.product.delete({ where: { id } });
  }

  async removeVariation(id: string, productId: string) {
    await this.findOneVariation(id, productId);
    return await this.prismaService.productVariation.delete({ where: { id } });
  }
}
