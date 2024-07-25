import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductVariationEntity } from '@/products/variations.entity';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { OrderEntity } from './orders.entity';

@Entity({ name: 'order_items' })
export class OrderItemEntity extends BaseEntity {
  @Column()
  quantity: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ type: 'float' })
  value: number;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'variation_id' })
  variationId: string;

  @ManyToOne(
    () => ProductVariationEntity,
    (variation) => variation.orderedItems,
    { onDelete: 'NO ACTION' },
  )
  @JoinColumn({ name: 'variation_id' })
  variation: ProductVariationEntity;
}
