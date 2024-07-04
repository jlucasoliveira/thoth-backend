import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsService } from '@/clients/clients.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { StockEntity } from '@/stock/stock.entity';
import { ClientEntity } from '@/clients/clients.entity';
import { ProductVariationEntity } from '@/products/variations.entity';
import { OrderEntity } from './orders.entity';
import { OrderItemEntity } from './order-items.entity';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Item, ResolvedOrder } from './types';

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
  ): Promise<ResolvedOrder> {
    let total = 0;

    const promises = orderItems.map<Promise<Item>>(
      async ({ variationId, quantity }) => {
        const variation = await this.variationRepository.findOne({
          where: { id: variationId },
          select: {
            price: true,
            variation: true,
            product: { name: true },
            stock: { quantity: true },
          },
        });

        if (!variation)
          throw new NotFoundException({
            id: variationId,
            message: 'Produto não encontrado',
          });

        if (variation.stock.quantity < quantity)
          throw new BadRequestException({
            id: variationId,
            message: `${variation.product.name} - ${variation.variation} sem estoque.`,
          });

        await tx
          .getRepository(StockEntity)
          .update(
            { variationId },
            { quantity: () => `quantity - ${quantity}` },
          );

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
    data: CreateOrderDTO,
  ) {
    const orderRepository = tx.getRepository(OrderEntity);
    const order = await orderRepository.save(
      orderRepository.create({ total: 0, clientId: client.id }),
    );

    const { total, items } = await this.ensureInventory(
      tx,
      order.id,
      data.items,
    );

    const orderItemRepository = tx.getRepository(OrderItemEntity);
    await orderItemRepository.save(orderItemRepository.create(items));

    await orderRepository.update(order.id, {
      total,
      paid: data.paid,
      clientId: client.id,
      totalPaid: data.totalPaid,
      paidDate:
        data.totalPaid === total ? () => 'CURRENT_TIMESTAMP' : undefined,
    });

    return order;
  }

  async create(data: CreateOrderDTO) {
    const client = await this.clientService.findOneOrDefault(data.userId);

    await this.orderRepository.manager.transaction(
      async (tx) => await this._create(tx, client, data),
    );
  }

  async findAll(params: PageOptions<OrderEntity>) {
    const [data, total] = await this.orderRepository.findAndCount(params);

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async findOne(id: string, raiseException = true) {
    const order = await this.orderRepository.findOne({ where: { id } });

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
