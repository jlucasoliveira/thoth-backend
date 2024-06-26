import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ProductVariationEntity } from '@/products/variations.entity';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { AttachmentSizeEntity } from './attachment-sizes.entity';

@Entity({ name: 'attachments' })
export class AttachmentEntity extends BaseEntity {
  @Column({ nullable: true })
  key?: string;

  @Column({ nullable: true })
  hash?: string;

  @Column({ name: 'variation_id', nullable: true })
  variationId?: string;

  @ManyToOne(() => ProductVariationEntity, (variation) => variation.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'variation_id',
    foreignKeyConstraintName: 'FK_attachment_to_variation_images',
  })
  variation: ProductVariationEntity;

  @OneToOne(() => ProductVariationEntity, (variation) => variation.icon, {
    onDelete: 'CASCADE',
  })
  variationIcon: ProductVariationEntity;

  @OneToMany(() => AttachmentSizeEntity, (size) => size.attachment)
  sizes: AttachmentSizeEntity[];
}
