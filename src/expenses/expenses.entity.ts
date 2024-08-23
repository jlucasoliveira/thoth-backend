import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OracleBoolean, convertIntoBoolean } from '@/utils/oracle-transformers';
import { BaseEntityWithIdInt } from '@/types/typeorm/base-entity';
import { BankAccountEntity } from '@/bank-accounts/bank-accounts.entity';
import { BrandEntity } from '@/brands/brands.entity';

@Entity({ name: 'expenses' })
export class ExpenseEntity extends BaseEntityWithIdInt {
  @Column()
  value: number;

  @Column({
    name: 'is_paid',
    type: 'char',
    length: 1,
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('isPaid'),
  })
  isPaid: boolean;

  @Column({ default: 1 })
  installments: number;

  @Column({ name: 'brand_id' })
  brandId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.expenses, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @Column({ name: 'account_id' })
  bankAccountId: number;

  @ManyToOne(() => BankAccountEntity, (account) => account.expenses)
  @JoinColumn({ name: 'account_id' })
  bankAccount: BankAccountEntity;
}
