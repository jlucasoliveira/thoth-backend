import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterStocksAddOnDeleteConstraint1720702508435
  implements MigrationInterface
{
  private readonly tableName = 'stocks';
  private readonly variationForeignKeyName = 'FK_stock_on_variation';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      this.tableName,
      this.variationForeignKeyName,
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.variationForeignKeyName,
        columnNames: ['variation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product_variations',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      this.tableName,
      this.variationForeignKeyName,
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.variationForeignKeyName,
        columnNames: ['variation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product_variations',
      }),
    );
  }
}
