import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { StockKind } from '@/stock/constants';
import { BrandEntity } from '@/brands/brands.entity';
import { StockEntity } from '@/stock/stock.entity';
import { StockEntryEntity } from '@/stock/stock-entries.entity';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { calcReversePercentage } from '@/utils/calculator';
import { CreateProductVariationDTO } from './dto/create-product-variation.dto';
import { UpdateProductVariationDTO } from './dto/update-product-variation.dto';
import { ProductVariationEntity } from './variations.entity';

type StockData = {
  quantity: number | undefined;
  costPrice: number | undefined;
};

type VariationData = Pick<StockData, 'costPrice'> & {
  price: number;
};

@Injectable()
export class VariationsServices {
  constructor(
    @InjectRepository(ProductVariationEntity)
    private readonly variationRepository: Repository<ProductVariationEntity>,
  ) {}

  async _create(
    user: Express.User,
    productId: number,
    payloads: Array<CreateProductVariationDTO>,
    tx?: EntityManager,
  ) {
    const data = this.variationRepository.create(
      payloads.map((payload) => ({ ...payload, productId })),
    );
    const variationPrices = new Map<string, VariationData>();
    const stocksData = new Map<string, StockData>(
      payloads.map(({ externalCode, quantity, costPrice }) => [
        externalCode,
        { quantity, costPrice },
      ]),
    );

    const variations = await tx
      .getRepository(ProductVariationEntity)
      .save(data);

    const stocksPayload: DeepPartial<StockEntity>[] = [];

    variations.forEach((variation) => {
      const data = stocksData.get(variation.externalCode);
      variationPrices.set(variation.id, {
        price: variation.price,
        costPrice: data.costPrice,
      });

      stocksPayload.push({
        variationId: variation.id,
        minQuantity: 5,
        quantity: data?.quantity ?? 0,
      });
    });

    const stockRepository = tx.getRepository(StockEntity);
    const stocks = await stockRepository.save(
      stockRepository.create(stocksPayload),
    );

    const brand = await tx.getRepository(BrandEntity).findOne({
      select: ['id', 'profitRate'],
      where: { products: { id: productId } },
    });

    const stockEntryRepository = tx.getRepository(StockEntryEntity);
    await stockEntryRepository.insert(
      stocks.map((stock) => {
        const { costPrice, price } = variationPrices.get(stock.variationId);
        const constPriceValue =
          costPrice ??
          calcReversePercentage({
            percentage: brand?.profitRate ?? 0,
            total: price,
          });

        return {
          userId: user.id,
          stockId: stock.id,
          kind: StockKind.ENTRY,
          amount: stock.quantity,
          entryDate: () => `CURRENT_TIMESTAMP`,
          expirationDate: () => `ADD_MONTHS(CURRENT_TIMESTAMP, 12)`,
          costPrice: constPriceValue,
        };
      }),
    );

    return variations;
  }

  async create(
    user: Express.User,
    productId: number,
    payloads: Array<CreateProductVariationDTO>,
    tx?: EntityManager,
  ) {
    if (tx) return await this._create(user, productId, payloads, tx);

    return await this.variationRepository.manager.transaction(
      async (tx) => await this._create(user, productId, payloads, tx),
    );
  }

  async findAll(params: PageOptions<ProductVariationEntity>) {
    const [data, total] = await this.variationRepository.findAndCount(params);

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
