import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { generateBaseColumns } from '@/utils/migrations/base-columns';

export class CreateAttachmentSizesTable1719317427098
  implements MigrationInterface
{
  private readonly tableName = 'attachments_sizes';
  private readonly attachmentForeignKeyName = 'FK_size_to_attachment';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.attachmentForeignKeyName,
            columnNames: ['attachment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'attachments',
            onDelete: 'CASCADE',
          }),
        ],
        columns: [
          ...generateBaseColumns(),
          new TableColumn({
            name: 'key',
            type: 'VARCHAR2(42)',
          }),
          new TableColumn({
            name: 'size',
            type: 'CHAR(2)',
          }),
          new TableColumn({
            name: 'attachment_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.attachmentForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
