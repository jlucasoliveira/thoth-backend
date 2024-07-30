import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders_payments' })
export class PaymentOrderEntity {
  @PrimaryColumn({ name: 'payment_id', type: 'number' })
  paymentId: number;

  @PrimaryColumn({ name: 'order_id', type: 'char', length: 36 })
  orderId: string;
}
