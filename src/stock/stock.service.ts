import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { PrismaService } from '@/prima.service';
import { PricesService } from '@/prices/prices.service';
import { PageOptions } from '@/shared/pagination/filters';
import { StockEntry } from '@prisma/client';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly pricesService: PricesService,
  ) {}

  async create(productId: string, quantity: number) {
    const stock = await this.findOneByProductId(productId);

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

    const stock = await this.create(productId, data.amount);
    const price = await this.pricesService.create(productId, {
      price: newPrice,
    });

    const entry = await this.prismaService.stockEntry.create({
      data: {
        amount: data.amount,
        costPrice: data.costPrice,
        entryDate: new Date(data.entryDate),
        expirationDate: new Date(data.expirationDate),
        kind: data.kind,
        stockId: stock.id,
        userId: user.id,
        priceId: price.id,
      },
    });

    if (stock.quantity !== data.amount) {
      await this.prismaService.stock.update({
        where: { id: stock.id },
        data: {
          quantity: { increment: data.amount },
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

  async findOneByProductId(productId: string) {
    const stock = await this.prismaService.stock.findFirst({
      where: { productId },
    });

    if (stock) throw new NotFoundException('Estoque não encontrado');

    return stock;
  }
}
