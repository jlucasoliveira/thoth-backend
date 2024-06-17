import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from '@prisma/client';
import { Transaction } from '@/types/prisma';
import { PrismaService } from '@/prima.service';
import { ClientsService } from '@/clients/clients.service';
import { PageOptions } from '@/shared/pagination/filters';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { Item, ResolvedOrder } from './types';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { CreateOrderDTO } from './dto/create-order.dto';
import { CreateOrderItemDTO } from './dto/create-order-item.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientService: ClientsService,
  ) {}

  private async ensureInventory(
    tx: Transaction,
    orderId: string,
    orderItems: CreateOrderItemDTO[],
  ): Promise<ResolvedOrder> {
    let total = 0;

    const promises = orderItems.map<Promise<Item>>(
      async ({ variationId, quantity }) => {
        const variation = await this.prismaService.productVariation.findUnique({
          where: { id: variationId },
          select: {
            price: true,
            variation: true,
            product: { select: { name: true } },
            stock: { select: { quantity: true } },
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

        await tx.stock.update({
          where: { variationId },
          data: { quantity: { decrement: quantity } },
        });

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

  private async _create(tx: Transaction, data: CreateOrderDTO) {
    const client = await this.clientService.findOneOrDefault(data.userId);
    const order = await tx.order.create({
      data: { total: 0, clientId: client.id },
    });
    const { total, items } = await this.ensureInventory(
      tx,
      order.id,
      data.items,
    );

    await tx.orderItem.createMany({ data: items });

    return await tx.order.update({
      where: { id: order.id },
      data: {
        total,
        paid: data.paid,
        clientId: client.id,
        totalPaid: data.totalPaid,
        paidDate: data.totalPaid === total ? new Date() : undefined,
      },
    });
  }

  async create(data: CreateOrderDTO) {
    return await this.prismaService.$transaction((tx) =>
      this._create(tx, data),
    );
  }

  async findAll(params: PageOptions<Order>) {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.order.findMany(params),
      this.prismaService.order.count(params),
    ]);

    const meta = new PageMetaDto({ itens: data.length, total, ...params });

    return { data, meta };
  }

  async findOne(id: string, raiseException = true) {
    const order = await this.prismaService.order.findFirst({ where: { id } });

    if (!order && raiseException)
      throw new NotFoundException('Pedido não encontrado');

    return order;
  }

  async update(id: string, data: UpdateOrderDTO) {
    await this.findOne(id);

    const order = await this.prismaService.order.update({
      where: { id },
      data,
    });

    return order;
  }

  async delete(id: string) {
    const order = await this.findOne(id);

    await this.prismaService.order.delete({ where: { id } });

    return order;
  }
}
