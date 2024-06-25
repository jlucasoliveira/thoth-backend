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
import { OracleBoolean } from '@/utils/oracle-transformers';

export class CreateOrdersTable1719320711671 implements MigrationInterface {
  private readonly tableName = 'orders';
  private readonly clientForeignKeyName = 'FK_orders_on_client';
  private readonly userForeignKeyName = 'FK_orders_on_user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        checks: [
          generateUUIDCheck(queryRunner.connection.driver.escape('id'), 'id'),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: this.clientForeignKeyName,
            columnNames: ['client_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'clients',
            onDelete: 'NO ACTION',
          }),
          new TableForeignKey({
            name: this.userForeignKeyName,
            columnNames: ['seller_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'NO ACTION',
          }),
        ],
        columns: [
          ...generateBaseColumns(),
          new TableColumn({
            name: 'paid',
            type: 'CHAR(1)',
            default: OracleBoolean.false,
          }),
          new TableColumn({
            name: 'total',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'total_paid',
            type: 'FLOAT',
            default: 0,
          }),
          new TableColumn({
            name: 'paid_date',
            type: 'TIMESTAMP',
            isNullable: true,
          }),
          new TableColumn({
            name: 'client_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.clientForeignKeyName,
          }),
          new TableColumn({
            name: 'seller_id',
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
