import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterProductMoveAttrIntoVariations1721140621519
  implements MigrationInterface
{
  private readonly productTableName = 'products';
  private readonly variationTableName = 'product_variations';

  private async moveColumns(queryRunner: QueryRunner, rollback = false) {
    const to = rollback ? this.productTableName : this.variationTableName;
    const from = !rollback ? this.productTableName : this.variationTableName;

    await queryRunner.dropColumns(from, ['weight', 'volume', 'gender']);
    await queryRunner.addColumns(to, [
      new TableColumn({
        name: 'weight',
        type: 'FLOAT',
        isNullable: true,
      }),
      new TableColumn({
        name: 'volume',
        type: 'FLOAT',
        isNullable: true,
      }),
      new TableColumn({
        name: 'gender',
        type: 'VARCHAR2(8)',
        isNullable: true,
      }),
    ]);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.moveColumns(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.moveColumns(queryRunner, true);
  }
}
