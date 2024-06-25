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

export class CreateStockLocationsTable1719255678971
  implements MigrationInterface
{
  private readonly tableName = 'stock_locations';
  private readonly stockForeignKeyName = 'FK_stock_location_on_stock';
  private readonly locationForeignKeyName = 'FK_stock_location_on_location';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        checks: [
          generateUUIDCheck(queryRunner.connection.driver.escape('id'), 'id'),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: this.stockForeignKeyName,
            columnNames: ['stock_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'stocks',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: this.locationForeignKeyName,
            columnNames: ['location_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'locations',
            onDelete: 'NO ACTION',
          }),
        ],
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'quantity',
            type: 'NUMBER',
          }),
          new TableColumn({
            name: 'stock_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.stockForeignKeyName,
          }),
          new TableColumn({
            name: 'location_id',
            type: 'NUMBER',
            foreignKeyConstraintName: this.locationForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
