import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Gender } from '@/types/gender';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { BrandEntity } from '@/brands/brands.entity';
import { CategoryEntity } from '@/categories/categories.entity';
import { ProductVariationEntity } from './variations.entity';

@Entity({ name: 'products', orderBy: { name: 'ASC' } })
export class ProductEntity extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'float', nullable: true })
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

  @ManyToMany(() => CategoryEntity, (category) => category.products, {
    onDelete: 'NO ACTION',
  })
  @JoinTable({
    name: 'categories_products',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_categories_on_products',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_products_on_categories',
    },
  })
  categories: CategoryEntity[];

  @OneToMany(() => ProductVariationEntity, (variation) => variation.product)
  variations: ProductVariationEntity[];
}
