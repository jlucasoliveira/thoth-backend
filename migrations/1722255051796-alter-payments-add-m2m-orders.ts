import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterPaymentsAddM2MOrders1722255051796
  implements MigrationInterface
{
  private readonly orderTableName = 'orders';
  private readonly paymentTableName = 'payments';
  private readonly orderFKColumn = 'order_id';
  private readonly paymentFKColumn = 'payment_id';
  private readonly relationTableName = 'orders_payments';
  private readonly orderForeignKeyName = 'FK_payments_to_order';
  private readonly paymentForeignKeyName = 'FK_orders_to_payment';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      this.orderTableName,
      this.paymentForeignKeyName,
    );
    await queryRunner.dropColumn(this.orderTableName, this.paymentFKColumn);
    await queryRunner.createTable(
      new Table({
        name: this.relationTableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.orderForeignKeyName,
            columnNames: [this.orderFKColumn],
            referencedColumnNames: ['id'],
            referencedTableName: this.orderTableName,
          }),
          new TableForeignKey({
            name: this.paymentForeignKeyName,
            columnNames: [this.paymentFKColumn],
            referencedColumnNames: ['id'],
            referencedTableName: this.paymentTableName,
          }),
        ],
        columns: [
          new TableColumn({
            name: this.orderFKColumn,
            type: 'CHAR(36)',
            foreignKeyConstraintName: this.orderForeignKeyName,
          }),
          new TableColumn({
            name: this.paymentFKColumn,
            type: 'NUMBER',
            foreignKeyConstraintName: this.paymentForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.relationTableName, true, true, true);
    await queryRunner.addColumn(
      this.orderTableName,
      new TableColumn({
        name: this.paymentFKColumn,
        type: 'NUMBER',
        isNullable: true,
        foreignKeyConstraintName: this.paymentForeignKeyName,
      }),
    );
    await queryRunner.createForeignKey(
      this.orderTableName,
      new TableForeignKey({
        name: this.paymentForeignKeyName,
        columnNames: [this.paymentFKColumn],
        referencedColumnNames: ['id'],
        referencedTableName: this.paymentTableName,
        onDelete: 'SET NULL',
      }),
    );
  }
}
