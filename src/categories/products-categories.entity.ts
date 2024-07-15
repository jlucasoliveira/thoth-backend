import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'categories_products' })
export class ProductCategoryEntity {
  @PrimaryColumn({ name: 'category_id', type: 'number' })
  categoryId: number;

  @PrimaryColumn({ name: 'product_id', type: 'number' })
  productId: number;
}
