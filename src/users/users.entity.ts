import { Column, Entity, OneToMany } from 'typeorm';
import { OracleBoolean, convertIntoBoolean } from '@/utils/oracle-transformers';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { StockEntryEntity } from '@/stock/stock-entries.entity';
import { OrderEntity } from '@/orders/orders.entity';
import { BankAccountEntity } from '@/bank-accounts/bank-accounts.entity';

@Entity({ name: 'users', orderBy: { createdAt: 'DESC' } })
export class UserEntity extends BaseEntity {
  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 60, nullable: true })
  name?: string;

  @Column({
    name: 'phone_number',
    length: 20,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({ name: 'last_login', nullable: true })
  lastLogin?: Date;

  @Column({
    type: 'char',
    name: 'is_admin',
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('isAdmin'),
  })
  isAdmin: boolean;

  @OneToMany(() => StockEntryEntity, (entry) => entry.user)
  stockEntries: StockEntryEntity[];

  @OneToMany(() => OrderEntity, (order) => order.seller)
  sales: OrderEntity[];

  @OneToMany(() => BankAccountEntity, (account) => account.owner)
  bankAccounts: BankAccountEntity[];
}
