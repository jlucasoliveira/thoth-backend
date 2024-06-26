import { BaseEntity } from '@/types/typeorm/base-model';
import { OrderItemEntity } from '../order-items.entity';

export type Item = Omit<
  OrderItemEntity,
  keyof BaseEntity | 'variation' | 'order'
>;

export type ResolvedOrder = {
  total: number;
  items: Item[];
};
