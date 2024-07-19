import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { ProductVariationEntity } from '@/products/variations.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @ManyToMany(() => ProductVariationEntity, (variation) => variation.categories)
  variations: ProductVariationEntity[];
}
