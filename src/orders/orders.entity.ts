import { ClientEntity } from '@/clients/clients.entity';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { OracleBoolean, convertIntoBoolean } from '@/utils/oracle-transformers';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderItemEntity } from './order-items.entity';
import { UserEntity } from '@/users/users.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('paid'),
  })
  paid: boolean;

  @Column()
  total: number;

  @Column({ name: 'total_paid' })
  totalPaid: number;

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
}
