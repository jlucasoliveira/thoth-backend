import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterPaymentsAddBankAccount1722962986841
  implements MigrationInterface
{
  private readonly tableName = 'payments';
  private readonly accountTableName = 'bank_accounts';
  private readonly columnName = 'account_id';
  private readonly foreignKeyName = 'FK_payments_to_account';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: this.columnName,
        type: 'NUMBER',
        isNullable: true,
        foreignKeyConstraintName: this.foreignKeyName,
      }),
    );

    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.foreignKeyName,
        columnNames: [this.columnName],
        referencedColumnNames: ['id'],
        referencedTableName: this.accountTableName,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKeyName);
    await queryRunner.dropColumn(this.tableName, this.columnName);
  }
}
