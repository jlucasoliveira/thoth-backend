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

export class CreateStockEntriesTable1719254584126
  implements MigrationInterface
{
  private readonly tableName = 'stock_entries';
  private readonly stockForeignKeyName = 'FK_stock_entry_on_stock';
  private readonly userForeignKeyName = 'FK_stock_entry_on_user';

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
            name: this.userForeignKeyName,
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'NO ACTION',
          }),
        ],
        columns: [
          ...generateBaseColumns(),
          new TableColumn({
            name: 'entry_date',
            type: 'TIMESTAMP',
          }),
          new TableColumn({
            name: 'cost_price',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'expiration_date',
            type: 'TIMESTAMP',
          }),
          new TableColumn({
            name: 'amount',
            type: 'NUMBER',
          }),
          new TableColumn({
            name: 'kind',
            type: 'VARCHAR2(7)',
          }),
          new TableColumn({
            name: 'stock_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.stockForeignKeyName,
          }),
          new TableColumn({
            name: 'user_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.userForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
