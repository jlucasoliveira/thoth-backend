import { OrderEntity } from '@/orders/orders.entity';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'clients' })
export class ClientEntity extends BaseEntity {
  @Column({ length: 60 })
  name: string;

  @Column({
    length: 20,
    name: 'phone_number',
    nullable: true,
  })
  phoneNumber?: string;

  @Column({ length: 60, nullable: true })
  email?: string;

  @OneToMany(() => OrderEntity, (order) => order.client)
  purchases: OrderEntity[];
}
