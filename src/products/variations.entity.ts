import { BaseEntity } from '@/types/typeorm/base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ProductEntity } from './products.entity';
import { CategoryEntity } from '@/categories/categories.entity';
import { StockEntity } from '@/stock/stock.entity';
import { AttachmentEntity } from '@/attachments/attachments.entity';
import { OrderItemEntity } from '@/orders/order-items.entity';
import { Gender } from '@/types/gender';

@Entity({ name: 'product_variations', orderBy: { variation: 'ASC' } })
export class ProductVariationEntity extends BaseEntity {
  @Column({ length: 60, nullable: true })
  variation?: string;

  @Column({ length: 15, name: 'external_code', unique: true })
  externalCode: string;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ type: 'float', nullable: true })
  volume?: number;

  @Column({ length: 8, nullable: true })
  gender?: Gender;

  @Column({ length: 20, name: 'bar_code', nullable: true })
  barcode?: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => ProductEntity, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @OneToOne(() => StockEntity, (stock) => stock.variation)
  stock: StockEntity;

  @Column({ name: 'icon_id', nullable: true })
  iconId?: string;

  @OneToOne(() => AttachmentEntity, (attachment) => attachment.variationIcon)
  @JoinColumn({
    name: 'icon_id',
    foreignKeyConstraintName: 'FK_variation_icon_to_attachment',
  })
  icon?: AttachmentEntity;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.variation)
  images: AttachmentEntity[];

  @OneToMany(() => OrderItemEntity, (item) => item.variation)
  orderedItems: OrderItemEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.variations, {
    onDelete: 'NO ACTION',
  })
  @JoinTable({
    name: 'variations_categories',
    joinColumn: {
      name: 'variation_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_categories_on_variations',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_products_on_categories',
    },
  })
  categories: CategoryEntity[];
}
