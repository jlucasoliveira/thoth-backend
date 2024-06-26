import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterAttachmentChangeHashLength1719344956347
  implements MigrationInterface
{
  private readonly tableName = 'attachments';
  private readonly currentColumnContent = {
    name: 'hash',
    type: 'VARCHAR2(20)',
    isNullable: true,
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      new TableColumn(this.currentColumnContent),
      new TableColumn({ ...this.currentColumnContent, type: 'VARCHAR2(60)' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      new TableColumn({ ...this.currentColumnContent, type: 'VARCHAR2(60)' }),
      new TableColumn(this.currentColumnContent),
    );
  }
}
