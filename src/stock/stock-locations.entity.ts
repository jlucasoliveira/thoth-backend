import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { StockEntity } from './stock.entity';
import { LocationEntity } from './locations.entity';

@Entity({ name: 'stock_locations' })
export class StockLocationEntity extends BaseEntity {
  @Column()
  quantity: number;

  @Column({ name: 'stock_id' })
  stockId: string;

  @ManyToOne(() => StockEntity, (stock) => stock.locations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: StockEntity;

  @Column({ name: 'location_id' })
  locationId: number;

  @ManyToOne(() => LocationEntity, (location) => location.stockLocations, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;
}
