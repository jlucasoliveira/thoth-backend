import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StockEntry, StockKind } from '@prisma/client';
import { PrismaService } from '@/prima.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { VariationsServices } from '@/products/variations.service';
import { BaseEntity } from '@/types/prisma';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { UpdateStockDTO } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly variationService: VariationsServices,
  ) {}

  async create(variationId: string, quantity: number) {
    const stock = await this.findOneByProductId(variationId, false);

    if (!stock) {
      if (quantity < 0)
        throw new BadRequestException(
          'Não é possível remover de um estoque inexistente',
        );

      return this.prismaService.stock.create({
        data: { quantity, variationId },
      });
    }

    return stock;
  }

  async update(id: string, data: UpdateStockDTO) {
    await this.findOne(id);

    return await this.prismaService.stock.update({
      where: { id },
      data,
    });
  }

  async createStockEntry(
    data: CreateStockEntryDto,
    user: Express.User,
    variationId: string,
  ) {
    data.amount = (data.kind !== StockKind.ENTRY ? -1 : 1) * data.amount;

    const stock = await this.create(variationId, data.amount);
    const payload: Omit<StockEntry, keyof BaseEntity> = {
      amount: data.amount,
      costPrice: data.costPrice ?? 0,
      entryDate: new Date(data.entryDate),
      expirationDate: new Date(data.expirationDate),
      kind: data.kind,
      stockId: stock.id,
      userId: user.id,
    };

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

    if (data.newValue !== undefined) {
      await this.variationService.update(stock.variationId, {
        price: data.newValue,
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

  async findByProductId(variationId: string, props: PageOptions<StockEntry>) {
    const stock = await this.findOneByProductId(variationId);
    return this.findAllEntries(stock.id, props);
  }

  async findOne(id: string) {
    const stock = await this.prismaService.stock.findFirst({ where: { id } });

    if (!stock) throw new NotFoundException('Estoque não encontrado');

    return stock;
  }

  async findOneByProductId(variationId: string, raiseException = true) {
    const stock = await this.prismaService.stock.findFirst({
      where: { variationId },
    });

    if (!stock && raiseException)
      throw new NotFoundException('Estoque não encontrado');

    return stock;
  }

  async delete(id: string) {
    const entry = await this.prismaService.stockEntry.findUnique({
      where: { id },
    });

    if (!entry) throw new NotFoundException('Entrada não encontrada');

    const operator = entry.kind === 'ENTRY' ? 'decrement' : 'increment';

    await this.prismaService.$transaction(async (tx) => {
      await tx.stock.update({
        data: { quantity: { [operator]: entry.amount } },
        where: { id: entry.stockId },
      });

      await tx.stockEntry.delete({ where: { id: entry.id } });
    });

    return entry;
  }
}
