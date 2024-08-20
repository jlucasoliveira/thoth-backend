import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { VariationsServices } from '@/products/variations.service';
import { BaseEntity } from '@/types/typeorm/base-model';
import { StockEntity } from './stock.entity';
import { StockEntryEntity } from './stock-entries.entity';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { UpdateStockDTO } from './dto/update-stock.dto';
import { StockKind } from './constants';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockEntity)
    private readonly stockRepository: Repository<StockEntity>,
    @InjectRepository(StockEntryEntity)
    private readonly stockEntryRepository: Repository<StockEntryEntity>,
    private readonly variationService: VariationsServices,
  ) {}

  async create(
    variationId: string,
    quantity: number,
  ): Promise<StockEntity & { isNew?: boolean }> {
    const stock = await this.findOneByProductId(variationId, false);

    if (!stock) {
      if (quantity < 0)
        throw new BadRequestException(
          'Não é possível remover de um estoque inexistente',
        );

      const newStock = await this.stockRepository.save(
        this.stockRepository.create({ quantity, variationId }),
      );

      return { ...newStock, isNew: true };
    }

    return stock;
  }

  async update(id: string, data: UpdateStockDTO) {
    await this.findOne(id);

    await this.stockRepository.update(id, data);

    return await this.findOne(id);
  }

  async createStockEntry(
    data: CreateStockEntryDto,
    user: Express.User,
    variationId: string,
  ) {
    data.amount = (data.kind !== StockKind.ENTRY ? -1 : 1) * data.amount;

    const stock = await this.create(variationId, data.amount);
    const payload: Omit<StockEntryEntity, keyof BaseEntity | 'user' | 'stock'> =
      {
        amount: data.amount,
        costPrice: data.costPrice ?? 0,
        entryDate: new Date(data.entryDate),
        expirationDate: new Date(data.expirationDate),
        kind: data.kind,
        stockId: stock.id,
        userId: user.id,
      };

    const entry = await this.stockEntryRepository.save(
      this.stockEntryRepository.create(payload),
    );

    const operation = data.kind === StockKind.ENTRY ? '+' : '-';

    if (!stock.isNew) {
      await this.stockRepository.update(stock.id, {
        quantity: () => `quantity ${operation} ${Math.abs(data.amount)}`,
      });
    }

    if (data.newValue !== undefined) {
      await this.variationService.update(stock.variationId, {
        price: data.newValue,
      });
    }

    return entry;
  }

  async findEntries(props: PageOptions<StockEntryEntity>) {
    const [data, total] = await this.stockEntryRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  findAllEntries(stockId: string, props: PageOptions<StockEntryEntity>) {
    props.where.stockId = stockId;
    return this.findEntries(props);
  }

  async findByProductId(
    variationId: string,
    props: PageOptions<StockEntryEntity>,
  ) {
    const stock = await this.findOneByProductId(variationId);
    return await this.findAllEntries(stock.id, props);
  }

  async findOne(id: string, raiseException = true) {
    const stock = await this.stockRepository.findOne({ where: { id } });

    if (!stock && raiseException)
      throw new NotFoundException('Estoque não encontrado');

    return stock;
  }

  async findOneByProductId(variationId: string, raiseException = true) {
    const stock = await this.stockRepository.findOne({
      where: { variationId },
    });

    if (!stock && raiseException)
      throw new NotFoundException('Estoque não encontrado');

    return stock;
  }

  async delete(id: string) {
    const entry = await this.stockEntryRepository.findOne({
      where: { id },
    });

    if (!entry) throw new NotFoundException('Entrada não encontrada');

    const operator = entry.kind === 'ENTRY' ? '-' : '+';

    await this.stockRepository.manager.transaction(async (tx) => {
      await tx.getRepository(StockEntity).update(entry.stockId, {
        quantity: () => `quantity ${operator} ${entry.amount}`,
      });

      await tx.getRepository(StockEntryEntity).delete(entry.id);
    });

    return entry;
  }
}
