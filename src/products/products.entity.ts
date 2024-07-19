import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { BrandEntity } from '@/brands/brands.entity';
import { ProductVariationEntity } from './variations.entity';

@Entity({ name: 'products', orderBy: { name: 'ASC' } })
export class ProductEntity extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @Column({ name: 'brand_id' })
  brandId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @OneToMany(() => ProductVariationEntity, (variation) => variation.product)
  variations: ProductVariationEntity[];
}
