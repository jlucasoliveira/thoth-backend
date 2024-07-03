import { BaseEntity } from '@/types/typeorm/base-entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ProductEntity } from './products.entity';
import { StockEntity } from '@/stock/stock.entity';
import { AttachmentEntity } from '@/attachments/attachments.entity';
import { OrderItemEntity } from '@/orders/order-items.entity';

@Entity({ name: 'product_variations', orderBy: { variation: 'ASC' } })
export class ProductVariationEntity extends BaseEntity {
  @Column({ length: 60, nullable: true })
  variation?: string;

  @Column({ length: 15, name: 'external_code' })
  externalCode: string;

  @Column({ length: 20, name: 'bar_code', nullable: true })
  barcode?: string;

  @Column()
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
}
