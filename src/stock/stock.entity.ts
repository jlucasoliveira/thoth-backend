import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { ProductVariationEntity } from '@/products/variations.entity';
import { StockEntryEntity } from './stock-entries.entity';
import { StockLocationEntity } from './stock-locations.entity';

@Entity({ name: 'stocks' })
export class StockEntity extends BaseEntity {
  @Column({ type: 'float' })
  quantity: number;

  @Column({ name: 'min_quantity', type: 'float', default: 0 })
  minQuantity: number;

  @Column({ name: 'variation_id' })
  variationId: string;

  @OneToOne(() => ProductVariationEntity, (variation) => variation.stock, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variation_id' })
  variation: ProductVariationEntity;

  @OneToMany(() => StockEntryEntity, (entry) => entry.stock)
  entries: StockEntryEntity[];

  @OneToMany(() => StockLocationEntity, (location) => location.stock)
  locations: StockLocationEntity[];
}
