import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PageMetaDto } from '@/shared/pagination/pageMeta.dto';
import { PageOptions } from '@/shared/pagination/filters';
import { OrderEntity } from '@/orders/orders.entity';
import { PaymentEntity } from './payments.entity';
import { CreatePaymentDTO } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async create(user: Express.User, payload: CreatePaymentDTO) {
    return await this.paymentRepository.manager.transaction(async (tx) => {
      const payment = tx
        .getRepository(PaymentEntity)
        .save(this.paymentRepository.create({ issuerId: user.id, ...payload }));

      const orderRepository = tx.getRepository(OrderEntity);

      const orders = await orderRepository.find({
        where: { paid: false },
        order: { createdAt: 'ASC' },
      });

      let totalValue = payload.value;
      const paidIds: string[] = [];
      let unpaidOrder: { id: string; value: number } | null = null;

      for (const order of orders) {
        if (totalValue === 0) break;
        const remainingValue = order.total - order.totalPaid;

        if (remainingValue > totalValue) {
          unpaidOrder = { id: order.id, value: totalValue };
          break;
        }

        paidIds.push(order.id);
        totalValue -= remainingValue;
      }

      if (paidIds.length > 0) {
        await orderRepository.update(paidIds, {
          paid: true,
          totalPaid: () => 'total',
        });
      }

      if (unpaidOrder?.id) {
        await orderRepository.update(unpaidOrder.id, {
          totalPaid: () => `totalPaid + ${unpaidOrder.value}`,
        });
      }

      return { ...payment, change: totalValue };
    });
  }

  async findAll(props: PageOptions<PaymentEntity>) {
    const [data, total] = await this.paymentRepository.findAndCount(props);

    const meta = new PageMetaDto({ itens: data.length, total, ...props });

    return { data, meta };
  }

  async findOne(id: number, raiseException = true) {
    const payment = await this.paymentRepository.findOneBy({ id });

    if (!payment && raiseException)
      throw new NotFoundException('Pagamento não encontrado');

    return payment;
  }

  async delete(id: number) {
    const payment = await this.findOne(id);

    await this.paymentRepository.delete(id);

    return payment;
  }
}
