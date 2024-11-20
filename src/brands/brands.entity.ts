import { Column, Entity, OneToMany } from 'typeorm';
import { ExpenseEntity } from '@/expenses/expenses.entity';
import { ProductEntity } from '@/products/products.entity';
import { CategoryEntity } from '@/categories/categories.entity';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { OracleBoolean, convertIntoBoolean } from '@/utils/oracle-transformers';

@Entity({ name: 'brands' })
export class BrandEntity extends BaseEntity {
  @Column({ length: 30 })
  name: string;

  @Column({ name: 'profit_rate', type: 'float' })
  profitRate: number;

  @Column({
    type: 'char',
    name: 'is_public',
    default: OracleBoolean.false,
    transformer: convertIntoBoolean('isPublic'),
  })
  isPublic: boolean;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];

  @OneToMany(() => ExpenseEntity, (expense) => expense.brand)
  expenses: ExpenseEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.brand)
  categories: CategoryEntity[];
}
