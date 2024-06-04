import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariation } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { Transaction } from '@/types/prisma';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';

@Injectable()
export class VariationsServices {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
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

  async findAll(params: PageOptions<ProductVariation>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.productVariation.findMany(params),
      this.prismaService.productVariation.count(params),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async findOne(id: string, productId?: string) {
    const variation = await this.prismaService.productVariation.findFirst({
      where: { id, productId },
    });

    if (!variation) throw new NotFoundException('Variação não encontrada');

    return variation;
  }

  async update(
    id: string,
    payload: UpdateProductVariationDTO,
    productId?: string,
  ) {
    await this.findOne(id, productId);

    return this.prismaService.productVariation.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: string, productId: string) {
    await this.findOne(id, productId);
    return await this.prismaService.productVariation.delete({ where: { id } });
  }
}
