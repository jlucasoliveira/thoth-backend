import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterCategoriesAddBrandRelation1732124401749
  implements MigrationInterface
{
  private readonly columnName = 'brand_id';
  private readonly tableName = 'categories';
  private readonly brandTableName = 'brands';
  private readonly foreignKeyName = 'FK_category_brand';

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
        referencedTableName: this.brandTableName,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKeyName);
    await queryRunner.dropColumn(this.tableName, this.columnName);
  }
}
