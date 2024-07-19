import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'variations_categories' })
export class ProductCategoryEntity {
  @PrimaryColumn({ name: 'category_id', type: 'number' })
  categoryId: number;

  @PrimaryColumn({ name: 'variation_id', type: 'char', length: 36 })
  variationId: string;
}
