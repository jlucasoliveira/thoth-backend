import { generateBaseColumns } from '@/utils/migrations/base-columns';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateOrderItemsTable1719321130531 implements MigrationInterface {
  private readonly tableName = 'order_items';
  private readonly orderForeignKeyName = 'FK_item_on_order';
  private readonly variationForeignKeyName = 'FK_item_on_variation';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.orderForeignKeyName,
            columnNames: ['order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'orders',
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: this.variationForeignKeyName,
            columnNames: ['variation_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'product_variations',
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
            name: 'total',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'value',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'order_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.orderForeignKeyName,
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
