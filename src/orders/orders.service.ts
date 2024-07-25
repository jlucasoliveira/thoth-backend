import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, FindOptionsRelations, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsService } from '@/clients/clients.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { StockEntity } from '@/stock/stock.entity';
import { ClientEntity } from '@/clients/clients.entity';
import { ProductEntity } from '@/products/products.entity';
import { ProductVariationEntity } from '@/products/variations.entity';
import { OrderEntity } from './orders.entity';
import { OrderItemEntity } from './order-items.entity';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Item, ResolvedOrder } from './types';

type Variation = {
  name: string;
  variation?: string;
  price: number;
  quantity: number;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductVariationEntity)
    private readonly variationRepository: Repository<ProductVariationEntity>,
    private readonly clientService: ClientsService,
  ) {}

  private async ensureInventory(
    tx: EntityManager,
    orderId: string,
    orderItems: CreateOrderItemDTO[],
    persistStock = true,
  ): Promise<ResolvedOrder> {
    let total = 0;

    const promises = orderItems.map<Promise<Item>>(
      async ({ variationId, quantity }) => {
        const variation = await this.variationRepository
          .createQueryBuilder('variation')
          .leftJoin(StockEntity, 'stock', 'stock.variation_id = variation.id')
          .leftJoin(
            ProductEntity,
            'product',
            'product.id = variation.product_id',
          )
          .select('variation.price', 'price')
          .addSelect('variation.variation', 'variation')
          .addSelect('COALESCE(stock.quantity, 0)', 'quantity')
          .addSelect('product.name', 'name')
          .where('variation.id = :id', { id: variationId })
          .getRawOne<Variation>();

        if (!variation)
          throw new NotFoundException({
            id: variationId,
            message: 'Produto não encontrado',
          });

        if (persistStock) {
          if (variation.quantity < quantity)
            throw new BadRequestException({
              id: variationId,
              message: `${variation.name} - ${variation.variation} sem estoque.`,
            });

          await tx
            .getRepository(StockEntity)
            .update(
              { variationId },
              { quantity: () => `quantity - ${quantity}` },
            );
        }

        total += variation.price * quantity;

        return {
          orderId,
          quantity,
          variationId,
          value: variation.price,
          total: variation.price * quantity,
        };
      },
    );

    const items = await Promise.all(promises);

    return { total, items };
  }

  private async _create(
    tx: EntityManager,
    client: ClientEntity,
    seller: Express.User,
    data: CreateOrderDTO,
  ) {
    const orderRepository = tx.getRepository(OrderEntity);
    const order = await orderRepository.save(
      orderRepository.create({
        total: 0,
        paid: data.paid,
        clientId: client.id,
        sellerId: seller.id,
      }),
    );

    const { total, items } = await this.ensureInventory(
      tx,
      order.id,
      data.items,
      data.persistStock,
    );

    const orderItemRepository = tx.getRepository(OrderItemEntity);
    await orderItemRepository.save(orderItemRepository.create(items));

    await orderRepository.update(order.id, {
      total,
      totalPaid: data.totalPaid,
      paidDate: data.paid ? () => 'CURRENT_TIMESTAMP' : undefined,
    });

    return order;
  }

  async create(seller: Express.User, data: CreateOrderDTO) {
    const client = await this.clientService.findOneOrDefault(data.clientId);

    await this.orderRepository.manager.transaction(
      async (tx) => await this._create(tx, client, seller, data),
    );
  }

  async findAll(params: PageOptions<OrderEntity>) {
    const [data, total] = await this.orderRepository.findAndCount(params);

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<OrderEntity>,
    raiseException = true,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations,
    });

    if (!order && raiseException)
      throw new NotFoundException('Pedido não encontrado');

    return order;
  }

  async update(id: string, data: UpdateOrderDTO) {
    await this.findOne(id);

    await this.orderRepository.update(id, data);

    return await this.findOne(id);
  }

  async delete(id: string) {
    const order = await this.findOne(id);

    await this.orderRepository.delete(id);

    return order;
  }
}
