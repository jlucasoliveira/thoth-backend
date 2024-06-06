import { OrderItem } from '@prisma/client';
import { BaseEntity } from '@/types/prisma';

export type Item = Omit<OrderItem, keyof BaseEntity>;

export type ResolvedOrder = {
  total: number;
  items: Item[];
};
