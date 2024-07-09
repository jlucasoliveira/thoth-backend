import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { ProductEntity } from '@/products/products.entity';

@Entity({ name: 'brands' })
export class BrandEntity extends BaseEntity {
  @Column({ length: 30 })
  name: string;

  @Column({ name: 'profit_rate', type: 'float' })
  profitRate: number;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];
}
