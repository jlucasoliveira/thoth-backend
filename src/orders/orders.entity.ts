import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClientEntity } from '@/clients/clients.entity';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { UserEntity } from '@/users/users.entity';
import { PaymentEntity } from '@/payments/payments.entity';
import { OracleBoolean, convertIntoBoolean } from '@/utils/oracle-transformers';
import { OrderItemEntity } from './order-items.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('paid'),
  })
  paid: boolean;

  @Column()
  total: number;

  @Column({ name: 'total_paid', default: 0 })
  totalPaid: number = 0;

  @Column({ name: 'paid_date', nullable: true })
  paidDate?: Date;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientEntity, (client) => client.purchases, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];

  @Column({ name: 'seller_id' })
  sellerId: string;

  @ManyToOne(() => UserEntity, (user) => user.sales, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'seller_id' })
  seller: UserEntity;

  @Column({ name: 'payment_id', nullable: true })
  paymentId?: number;

  @ManyToOne(() => PaymentEntity, (payment) => payment.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'payment_id' })
  payment?: PaymentEntity;
}
