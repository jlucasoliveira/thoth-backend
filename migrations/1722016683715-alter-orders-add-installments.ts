import { OracleBoolean } from '@/utils/oracle-transformers';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterOrdersAddInstallments1722016683715
  implements MigrationInterface
{
  private readonly tableName = 'orders';
  private readonly installmentColumnName = 'installments';
  private readonly retainedStockColumnName = 'retained_stock';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(this.tableName, [
      new TableColumn({
        name: this.installmentColumnName,
        type: 'SMALLINT',
        default: 1,
      }),
      new TableColumn({
        name: this.retainedStockColumnName,
        type: 'CHAR(1)',
        default: OracleBoolean.false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(this.tableName, [
      this.installmentColumnName,
      this.retainedStockColumnName,
    ]);
  }
}
