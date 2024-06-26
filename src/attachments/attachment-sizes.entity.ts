import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SizeKind } from '@/types/size-kind';
import { BaseEntity } from '@/types/typeorm/base-entity';
import { padIntoLength } from '@/utils/oracle-transformers';
import { AttachmentEntity } from './attachments.entity';

@Entity({ name: 'attachments_sizes' })
export class AttachmentSizeEntity extends BaseEntity {
  @Column()
  key: string;

  @Column({ length: 2, transformer: padIntoLength() })
  size: SizeKind;

  @Column({ name: 'attachment_id' })
  attachmentId: string;

  @ManyToOne(() => AttachmentEntity, (attachment) => attachment.sizes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attachment_id' })
  attachment: AttachmentEntity;
}
