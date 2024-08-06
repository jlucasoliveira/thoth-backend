import { PaymentEntity } from '@/payments/payments.entity';
import { BaseEntityWithIdInt } from '@/types/typeorm/base-entity';
import { UserEntity } from '@/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'bank_accounts' })
export class BankAccountEntity extends BaseEntityWithIdInt {
  @Column({ type: 'varchar2', length: 30 })
  name: string;

  @Column({ type: 'varchar2', length: 10, nullable: true })
  agency?: string;

  @Column({
    name: 'account_number',
    type: 'varchar2',
    length: 15,
    nullable: true,
  })
  accountNumber?: string;

  @Column({ name: 'owner_id', type: 'char', length: 36, nullable: true })
  ownerId?: string;

  @ManyToOne(() => UserEntity, (user) => user.bankAccounts, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'owner_id' })
  owner?: UserEntity;

  @OneToMany(() => PaymentEntity, (payment) => payment.bankAccount, {
    onDelete: 'NO ACTION',
  })
  payments: PaymentEntity[];
}
