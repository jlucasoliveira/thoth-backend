import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityWithIdInt as BaseEntity } from '@/types/typeorm/base-entity';
import { StockLocationEntity } from './stock-locations.entity';
import { StockEntity } from './stock.entity';

@Entity({ name: 'locations' })
export class LocationEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => StockEntity, (stockLocation) => stockLocation.locations)
  stockLocations: StockLocationEntity[];
}
