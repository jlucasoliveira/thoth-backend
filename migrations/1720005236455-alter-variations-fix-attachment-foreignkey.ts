import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterVariationsFixAttachmentForeignKey1720005236455
  implements MigrationInterface
{
  private readonly tableName = 'product_variations';
  private readonly referencedTableName = 'attachments';
  private readonly attachmentForeignKeyName = 'FK_variation_icon_to_attachment';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      this.tableName,
      this.attachmentForeignKeyName,
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.attachmentForeignKeyName,
        columnNames: ['icon_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.referencedTableName,
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.attachmentForeignKeyName,
        columnNames: ['icon_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableName,
        onDelete: 'SET NULL',
      }),
    );
  }
}
