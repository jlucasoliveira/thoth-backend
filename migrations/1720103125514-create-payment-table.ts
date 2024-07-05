import {
  generateBaseColumns,
  generateUUIDCheck,
} from '@/utils/migrations/base-columns';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreatePaymentTable1720103125514 implements MigrationInterface {
  private readonly tableName = 'payments';
  private readonly orderTableName = 'orders';
  private readonly foreignKeyName = 'FK_orders_to_payment';
  private readonly clientForeignKeyName = 'FK_payments_on_client';
  private readonly userForeignKeyName = 'FK_payments_on_user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        checks: [
          generateUUIDCheck(
            queryRunner.connection.driver.escape('client_id'),
            'client_id',
          ),
          generateUUIDCheck(
            queryRunner.connection.driver.escape('issuer_id'),
            'issuer_id',
          ),
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
            columnNames: ['issuer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'NO ACTION',
          }),
        ],
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'value',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'paid_date',
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
          }),
          new TableColumn({
            name: 'client_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.clientForeignKeyName,
          }),
          new TableColumn({
            name: 'issuer_id',
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.userForeignKeyName,
          }),
        ],
      }),
    );
    await queryRunner.addColumn(
      this.orderTableName,
      new TableColumn({
        name: 'payment_id',
        type: 'NUMBER',
        isNullable: true,
        foreignKeyConstraintName: this.foreignKeyName,
      }),
    );
    await queryRunner.createForeignKey(
      this.orderTableName,
      new TableForeignKey({
        name: this.foreignKeyName,
        columnNames: ['payment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableName,
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.orderTableName, this.foreignKeyName);
    await queryRunner.dropColumn(this.orderTableName, 'payment_id');
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
