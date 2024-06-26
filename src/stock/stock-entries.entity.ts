import { BaseEntity } from '@/types/typeorm/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { StockKind } from './constants';
import { StockEntity } from './stock.entity';
import { UserEntity } from '@/users/users.entity';

@Entity({ name: 'stock_entries' })
export class StockEntryEntity extends BaseEntity {
  @Column({ name: 'entry_date' })
  entryDate: Date;

  @Column({ name: 'cost_price' })
  costPrice: number;

  @Column({ name: 'expiration_date' })
  expirationDate: Date;

  @Column()
  amount: number;

  @Column({ length: 7 })
  kind: StockKind;

  @Column({ name: 'stock_id' })
  stockId: string;

  @ManyToOne(() => StockEntity, (stock) => stock.entries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: StockEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.stockEntries, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
