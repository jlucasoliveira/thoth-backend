import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StockEntry, StockKind } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { PricesService } from '@/prices/prices.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { BaseEntity } from '@/types/prisma';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pricesService: PricesService,
  ) {}

  async create(productId: string, quantity: number) {
    const stock = await this.findOneByProductId(productId, false);

    if (!stock) {
      if (quantity < 0)
        throw new BadRequestException(
          'Não é possível remover de um estoque inexistente',
        );

      return this.prismaService.stock.create({
        data: { quantity, productId },
      });
    }

    return stock;
  }

  async createStockEntry(
    createStockDto: CreateStockEntryDto,
    user: Express.User,
    productId: string,
  ) {
    const { newPrice, ...data } = createStockDto;

    data.amount = (data.kind !== StockKind.ENTRY ? -1 : 1) * data.amount;

    const stock = await this.create(productId, data.amount);
    const payload: Omit<StockEntry, keyof BaseEntity> = {
      amount: data.amount,
      costPrice: data.costPrice ?? 0,
      entryDate: new Date(data.entryDate),
      expirationDate: new Date(data.expirationDate),
      kind: data.kind,
      stockId: stock.id,
      userId: user.id,
      priceId: null,
    };

    if (newPrice !== undefined && data.kind === StockKind.ENTRY) {
      const price = await this.pricesService.create(productId, {
        price: newPrice,
      });
      payload.priceId = price.id;
    }

    const entry = await this.prismaService.stockEntry.create({
      data: payload,
    });

    const operation = data.kind === StockKind.ENTRY ? 'increment' : 'decrement';

    if (stock.quantity !== data.amount) {
      await this.prismaService.stock.update({
        where: { id: stock.id },
        data: {
          quantity: { [operation]: Math.abs(data.amount) },
        },
      });
    }

    return entry;
  }

  async findEntries(props: PageOptions<StockEntry>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.stockEntry.findMany(props),
      this.prismaService.stockEntry.count(),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  findAllEntries(stockId: string, props: PageOptions<StockEntry>) {
    props.where.stockId = stockId;
    return this.findEntries(props);
  }

  async findByProductId(productId: string, props: PageOptions<StockEntry>) {
    const stock = await this.findOneByProductId(productId);
    return this.findAllEntries(stock.id, props);
  }

  async findOne(id: string) {
    const stock = await this.prismaService.stock.findFirst({ where: { id } });

    if (!stock) throw new NotFoundException('Estoque não encontrado');

    return stock;
  }

  async findOneByProductId(productId: string, raiseException = true) {
    const stock = await this.prismaService.stock.findFirst({
      where: { productId },
    });

    if (!stock && raiseException)
      throw new NotFoundException('Estoque não encontrado');

    return stock;
  }
}
