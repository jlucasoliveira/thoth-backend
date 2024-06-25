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

export class CreateStocksTable1719254252559 implements MigrationInterface {
  private readonly tableName = 'stocks';
  private readonly variationForeignKeyName = 'FK_stock_on_variation';

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
          }),
        ],
        columns: [
          ...generateBaseColumns(),
          new TableColumn({
            name: 'quantity',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'min_quantity',
            type: 'FLOAT',
            default: 0,
          }),
          new TableColumn({
            name: 'variation_id',
            type: 'CHAR(36)',
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
