import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

abstract class CommonEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}

export abstract class BaseEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export abstract class BaseEntityWithIdInt extends CommonEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
