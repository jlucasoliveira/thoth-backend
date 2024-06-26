import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from '@/categories/categories.entity';
import { BrandEntity } from '@/brands/brands.entity';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { Gender } from '@/types/gender';
import { ProductVariationEntity } from './variations.entity';

@Entity({ name: 'products', orderBy: { name: 'ASC' } })
export class ProductEntity extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @Column({ nullable: true })
  weight?: number;

  @Column({ nullable: true })
  volume?: number;

  @Column({ length: 8, nullable: true })
  gender?: Gender;

  @Column({ name: 'brand_id' })
  brandId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity;

  @Column({ type: 'number', name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => ProductVariationEntity, (variation) => variation.product)
  variations: ProductVariationEntity[];
}
