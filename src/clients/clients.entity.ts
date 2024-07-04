import { AfterLoad, Column, Entity, OneToMany } from 'typeorm';
import { OrderEntity } from '@/orders/orders.entity';
import { BaseEntity } from '@/types/typeorm/base-entity';

@Entity({ name: 'clients' })
export class ClientEntity extends BaseEntity {
  isDefault = false;
  static defaultName = 'Comprador Avulso';

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

  @AfterLoad()
  private generateVirtualDefault() {
    this.isDefault = this.name == ClientEntity.defaultName;
  }
}
