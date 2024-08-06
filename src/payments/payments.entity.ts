import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntityWithIdInt } from '@/types/typeorm/base-entity';
import { OrderEntity } from '@/orders/orders.entity';
import { UserEntity } from '@/users/users.entity';
import { ClientEntity } from '@/clients/clients.entity';
import { BankAccountEntity } from '@/bank-accounts/bank-accounts.entity';

@Entity({ name: 'payments' })
export class PaymentEntity extends BaseEntityWithIdInt {
  @Column({ type: 'float' })
  value: number;

  @Column({
    name: 'paid_date',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  })
  paidDate: Date;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientEntity, (client) => client.purchases, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ name: 'issuer_id' })
  issuerId: string;

  @ManyToOne(() => UserEntity, (user) => user.sales, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'issuer_id' })
  issuer: UserEntity;

  @ManyToMany(() => OrderEntity, (order) => order.payments, {
    onDelete: 'NO ACTION',
  })
  orders: OrderEntity[];

  @Column({ name: 'account_id', nullable: true })
  bankAccountId?: number;

  @ManyToOne(() => BankAccountEntity, (account) => account.payments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'account_id' })
  bankAccount?: BankAccountEntity;
}
