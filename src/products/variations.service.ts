import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsRelations, Repository } from 'typeorm';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { StockEntity } from '@/stock/stock.entity';
import { ProductVariationEntity } from './variations.entity';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';

@Injectable()
export class VariationsServices {
  constructor(
    @InjectRepository(ProductVariationEntity)
    private readonly variationRepository: Repository<ProductVariationEntity>,
  ) {}

  async create(
    productId: number,
    payloads: Array<CreateProductVariationDTO>,
    tx?: EntityManager,
  ) {
    const data = this.variationRepository.create(
      payloads.map((payload) => ({ ...payload, productId })),
    );

    async function createVariationsWithStock(tx: EntityManager) {
      const variations = await tx
        .getRepository(ProductVariationEntity)
        .save(data);

      const stockRepository = tx.getRepository(StockEntity);
      await stockRepository.save(
        stockRepository.create(
          variations.map((variation) => ({
            variationId: variation.id,
            minQuantity: 5,
            quantity: 0,
          })),
        ),
      );

      return variations;
    }

    if (tx) return await createVariationsWithStock(tx);

    return await this.variationRepository.manager.transaction(
      async (tx) => await createVariationsWithStock(tx),
    );
  }

  async findAll(
    params: PageOptions<ProductVariationEntity>,
    relations?: FindOptionsRelations<ProductVariationEntity>,
  ) {
    const [data, total] = await this.variationRepository.findAndCount({
      ...params,
      relations,
    });

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async findOne(id: string, productId?: number) {
    const variation = await this.variationRepository.findOne({
      where: { id, productId },
    });

    if (!variation) throw new NotFoundException('Variação não encontrada');

    return variation;
  }

  async update(
    id: string,
    payload: UpdateProductVariationDTO,
    productId?: number,
  ) {
    await this.findOne(id, productId);

    await this.variationRepository.update(id, payload);

    return await this.findOne(id, productId);
  }

  async remove(id: string, productId: number) {
    const variation = await this.findOne(id, productId);

    await this.variationRepository.delete(id);

    return variation;
  }
}
