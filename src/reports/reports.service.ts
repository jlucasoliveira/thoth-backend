import { DataSource, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/users.entity';
import { OrderEntity } from '@/orders/orders.entity';
import { ClientEntity } from '@/clients/clients.entity';
import { SalesByDateRangeDTO } from './dto/sales-by-range.dto';
import { StockEntity } from '@/stock/stock.entity';
import { StockEntryEntity } from '@/stock/stock-entries.entity';
import { StockKind } from '@/stock/constants';
import { ProductVariationEntity } from '@/products/variations.entity';
import { ProductEntity } from '@/products/products.entity';
import { StockResumeDTO } from './dto/stock-resume.dto';
import { convertIntoBoolean } from '@/utils/oracle-transformers';
import { OrderItemEntity } from '@/orders/order-items.entity';
import { BrandEntity } from '@/brands/brands.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(ProductVariationEntity)
    private readonly productVariationRepository: Repository<ProductVariationEntity>,
  ) {}

  /** @todo */
  private toDate = (
    alias: string,
    isVariable = true,
    onlyMonth = false,
  ): string => {
    const name = (isVariable ? ':' : '') + alias;
    let datePattern = 'YYYY-MM';

    if (!onlyMonth) datePattern = datePattern + '-DD';

    return `TO_DATE(${name}, '${datePattern}')`;
  };

  async salesByDateRange(criteria: SalesByDateRangeDTO) {
    let query = this.dataSource
      .createQueryBuilder()
      .from(OrderItemEntity, 'item')
      .leftJoin(OrderEntity, 'order', 'order.id = item.order_id')
      .select('COALESCE(SUM(order.totalPaid), 0)', 'totalPaid')
      .addSelect('COALESCE(SUM(order.total), 0)', 'totalSold')
      .where(
        `order.created_at BETWEEN ${this.toDate('startDate')} AND ${this.toDate(
          'endDate',
        )}`,
        criteria,
      );

    if (criteria.isPaid !== undefined)
      query = query.andWhere('order.paid = :isPaid', {
        isPaid: convertIntoBoolean('isPaid').to(criteria.isPaid),
      });

    if (criteria.brands) {
      const filter = (criteria.filter === 'ne' ? 'NOT ' : '') + 'IN';
      query = query
        .leftJoin(
          ProductVariationEntity,
          'variation',
          'variation.id = item.variation_id',
        )
        .leftJoin(ProductEntity, 'product', 'variation.product_id = product.id')
        .leftJoin(BrandEntity, 'brand', 'brand.id = product.brand_id')
        .andWhere(`brand.id ${filter}(:...brands)`, criteria);
    }

    if (criteria.clientId) {
      query = query
        .leftJoin(ClientEntity, 'client', 'client.id = order.client_id')
        .andWhere('client.id = :clientId', criteria)
        .addGroupBy('client.id');
    }

    if (criteria.userId) {
      query = query
        .leftJoin(UserEntity, 'seller', 'seller.id = order.seller_id')
        .andWhere('seller.id = :userId', criteria)
        .addGroupBy('seller.id');
    }

    const rest = await query.getRawOne();

    return rest;
  }

  async stockResume({ lowStock }: StockResumeDTO) {
    const query = this.dataSource
      .createQueryBuilder(StockEntity, 'stock')
      .leftJoin(
        StockEntryEntity,
        'entry',
        'entry.stock_id = stock.id AND entry.kind = :kind',
        { kind: StockKind.ENTRY },
      )
      .leftJoin(
        ProductVariationEntity,
        'variation',
        'variation.id = stock.variation_id',
      )
      .leftJoin(ProductEntity, 'product', 'product.id = variation.product_id')
      .select('product.name', 'product')
      .addSelect('variation.variation', 'variation')
      .addSelect('stock.quantity', 'quantity')
      .addSelect('stock.min_quantity', 'minQuantity')
      .groupBy('product.name')
      .addGroupBy('variation.variation')
      .addGroupBy('stock.quantity')
      .addGroupBy('stock.min_quantity')
      .having('SUM(entry.amount) > 0');

    if (lowStock) query.andWhere('stock.quantity <= stock.min_quantity');

    return query.getRawMany();
  }

  async reportStockResume() {
    const variations = await this.productVariationRepository.find({
      relations: {
        categories: true,
        product: { brand: true },
        stock: { entries: true },
      },
      select: {
        categories: { name: true },
        externalCode: true,
        gender: true,
        id: true,
        price: true,
        product: {
          id: true,
          name: true,
          brand: { name: true, profitRate: true },
        },
        stock: { quantity: true, entries: { costPrice: true } },
        variation: true,
        volume: true,
        weight: true,
      },
      where: { stock: { quantity: MoreThan(0) } },
    });

    const parsed = variations.map((variation) => {
      const [total, validCount] = variation.stock.entries.reduce(
        ([total, validCount], cur) => [
          total + (cur.costPrice ?? 0),
          validCount + (cur.costPrice ? 1 : 0),
        ],
        [0, 0],
      );
      const costPrice =
        validCount !== 0
          ? total / validCount
          : +(
              ((100 - variation.product.brand.profitRate) / 100) *
              variation.price
            ).toFixed(2);

      return [
        variation.product.brand.name,
        variation.product.id,
        variation.product.name,
        variation.id,
        variation.externalCode,
        variation.variation,
        variation.stock.quantity,
        variation.price,
        costPrice,
        variation.price * variation.stock.quantity,
        costPrice * variation.stock.quantity,
        variation.volume ?? '',
        variation.weight ?? '',
        variation.categories.map(({ name }) => name).join(', '),
      ].join(';');
    });

    const headers = [
      'Marca',
      'ID Produto',
      'Produto',
      'ID Variação',
      'Código Externo',
      'Nome',
      'Quantidade',
      'Valor',
      'Valor de compra',
      'Total',
      'Total de compra',
      'Volume (ml)',
      'Peso (g)',
      'Categorias',
    ].join(';');

    parsed.unshift(headers);

    return parsed.join('\n');
  }
}
