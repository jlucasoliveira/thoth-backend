import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { ProductVariationEntity } from '@/products/variations.entity';
import { BrandEntity } from '@/brands/brands.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @Column({ name: 'brand_id', nullable: true })
  brandId?: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.categories, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brand_id' })
  brand?: BrandEntity;

  @ManyToMany(() => ProductVariationEntity, (variation) => variation.categories)
  variations: ProductVariationEntity[];
}
