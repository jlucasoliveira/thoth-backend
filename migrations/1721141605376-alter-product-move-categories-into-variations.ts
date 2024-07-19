import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterProductMoveCategoriesIntoVariations1721141605376
  implements MigrationInterface
{
  private readonly productTableName = 'products';
  private readonly variationTableName = 'product_variations';
  private readonly categoryTableName = 'categories';
  private readonly productCategoryTableName = 'products_categories';
  private readonly variationCategoryTableName = 'variations_categories';
  private readonly productsForeignKeyName = 'FK_categories_on_products';
  private readonly categoriesForeignKeyName = 'FK_variations_on_categories';
  private readonly olCategoriesForeignKeyName = 'FK_products_on_categories';
  private readonly variationsForeignKeyName = 'FK_categories_on_variations';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      this.productCategoryTableName,
      true,
      true,
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: this.variationCategoryTableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.categoriesForeignKeyName,
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: this.categoryTableName,
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: this.variationsForeignKeyName,
            columnNames: ['variation_id'],
            referencedColumnNames: ['id'],
            referencedTableName: this.variationTableName,
            onDelete: 'CASCADE',
          }),
        ],
        columns: [
          new TableColumn({
            name: 'category_id',
            type: 'NUMBER',
            isPrimary: true,
            foreignKeyConstraintName: this.categoriesForeignKeyName,
          }),
          new TableColumn({
            name: 'variation_id',
            type: 'CHAR(36)',
            isPrimary: true,
            foreignKeyConstraintName: this.variationsForeignKeyName,
          }),
        ],
      }),
      true,
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      this.variationCategoryTableName,
      true,
      true,
      true,
    );
    await queryRunner.createTable(
      new Table({
        name: this.productCategoryTableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.olCategoriesForeignKeyName,
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: this.categoryTableName,
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: this.productsForeignKeyName,
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: this.productTableName,
            onDelete: 'CASCADE',
          }),
        ],
        columns: [
          new TableColumn({
            name: 'category_id',
            type: 'NUMBER',
            isPrimary: true,
          }),
          new TableColumn({
            name: 'product_id',
            type: 'NUMBER',
            isPrimary: true,
          }),
        ],
      }),
      true,
      true,
    );
  }
}
