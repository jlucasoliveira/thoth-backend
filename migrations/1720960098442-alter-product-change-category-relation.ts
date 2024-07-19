import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterProductChangeCategoryRelation1720960098442
  implements MigrationInterface
{
  private readonly productTableName = 'products';
  private readonly categoryTableName = 'categories';
  private readonly oldCategoryColumn = 'category_id';
  private readonly productColumn = 'product_id';
  private readonly manyToManyTableName = 'categories_products';
  private readonly categoriesForeignKeyName = 'FK_products_on_categories';
  private readonly productsForeignKeyName = 'FK_categories_on_products';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      this.productTableName,
      this.categoriesForeignKeyName,
    );
    await queryRunner.dropColumn(this.productTableName, this.oldCategoryColumn);

    await queryRunner.createTable(
      new Table({
        name: this.manyToManyTableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.categoriesForeignKeyName,
            columnNames: [this.oldCategoryColumn],
            referencedTableName: this.categoryTableName,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: this.productsForeignKeyName,
            columnNames: [this.productColumn],
            referencedTableName: this.productTableName,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
        columns: [
          new TableColumn({
            name: this.oldCategoryColumn,
            type: 'NUMBER',
            isPrimary: true,
            foreignKeyConstraintName: this.categoriesForeignKeyName,
          }),
          new TableColumn({
            name: this.productColumn,
            type: 'NUMBER',
            isPrimary: true,
            foreignKeyConstraintName: this.productsForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.manyToManyTableName, true, true, true);

    await queryRunner.addColumn(
      this.productTableName,
      new TableColumn({
        name: this.oldCategoryColumn,
        type: 'NUMBER',
        isNullable: true,
        foreignKeyConstraintName: this.categoriesForeignKeyName,
      }),
    );
    await queryRunner.createForeignKey(
      this.productTableName,
      new TableForeignKey({
        name: this.categoriesForeignKeyName,
        columnNames: [this.oldCategoryColumn],
        referencedColumnNames: ['id'],
        referencedTableName: this.categoryTableName,
        onDelete: 'NO ACTION',
      }),
    );
  }
}
