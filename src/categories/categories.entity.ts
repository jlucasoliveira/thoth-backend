import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { ProductEntity } from '@/products/products.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ length: 30 })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
