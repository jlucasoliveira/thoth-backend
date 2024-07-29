import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ClientEntity } from '@/clients/clients.entity';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { UserEntity } from '@/users/users.entity';
import { PaymentEntity } from '@/payments/payments.entity';
import { OracleBoolean, convertIntoBoolean } from '@/utils/oracle-transformers';
import { OrderItemEntity } from './order-items.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({
    type: 'char',
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('paid'),
  })
  paid: boolean;

  @Column({
    type: 'char',
    name: 'retained_stock',
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('retainedStock'),
  })
  retainedStock: boolean;

  @Column({ type: 'smallint', default: 1 })
  installments?: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ name: 'total_paid', type: 'float', default: 0 })
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

  @ManyToMany(() => PaymentEntity, (payment) => payment.orders, {
    onDelete: 'NO ACTION',
  })
  @JoinTable({
    name: 'orders_payments',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_payments_to_order',
    },
    inverseJoinColumn: {
      name: 'payment_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_orders_to_payment',
    },
  })
  payments: PaymentEntity[];
}
