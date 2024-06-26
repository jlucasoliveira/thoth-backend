import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAttachmentChangeKeyLength1719345820566
  implements MigrationInterface
{
  private readonly attachmentTableName = 'attachments';
  private readonly attachmentSizeTableName = 'attachments_sizes';
  private readonly currentColumnDefinition = {
    name: 'key',
    type: 'VARCHAR2(42)',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.attachmentTableName,
      new TableColumn({ ...this.currentColumnDefinition, isNullable: true }),
      new TableColumn({
        ...this.currentColumnDefinition,
        type: 'VARCHAR2(150)',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      this.attachmentSizeTableName,
      new TableColumn(this.currentColumnDefinition),
      new TableColumn({
        ...this.currentColumnDefinition,
        type: 'VARCHAR2(150)',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.attachmentTableName,
      new TableColumn({
        ...this.currentColumnDefinition,
        type: 'VARCHAR2(150)',
        isNullable: true,
      }),
      new TableColumn({ ...this.currentColumnDefinition, isNullable: true }),
    );
    await queryRunner.changeColumn(
      this.attachmentSizeTableName,
      new TableColumn({
        ...this.currentColumnDefinition,
        type: 'VARCHAR2(150)',
      }),
      new TableColumn(this.currentColumnDefinition),
    );
  }
}
