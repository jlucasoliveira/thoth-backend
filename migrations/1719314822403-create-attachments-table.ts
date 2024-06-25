import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import {
  generateBaseColumns,
  generateUUIDCheck,
} from '@/utils/migrations/base-columns';

export class CreateAttachmentsTable1719314822403 implements MigrationInterface {
  private readonly tableName = 'attachments';
  private readonly variationForeignKeyName =
    'FK_attachment_to_variation_images';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        checks: [
          generateUUIDCheck(queryRunner.connection.driver.escape('id'), 'id'),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: this.variationForeignKeyName,
            columnNames: ['variation_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'product_variations',
            onDelete: 'CASCADE',
          }),
        ],
        columns: [
          ...generateBaseColumns(),
          new TableColumn({
            name: 'key',
            type: 'VARCHAR2(42)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'hash',
            type: 'VARCHAR2(20)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'variation_id',
            type: 'CHAR(36)',
            isNullable: true,
            foreignKeyConstraintName: this.variationForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
