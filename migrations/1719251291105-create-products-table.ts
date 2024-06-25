import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { generateBaseColumns } from '@/utils/migrations/base-columns';

export class CreateProductsTable1719251291105 implements MigrationInterface {
  private readonly tableName = 'products';
  private readonly brandsForeignKeyName = 'FK_products_on_brands';
  private readonly categoriesForeignKeyName = 'FK_products_on_categories';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.brandsForeignKeyName,
            columnNames: ['brand_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'brands',
            onDelete: 'NO ACTION',
          }),
          new TableForeignKey({
            name: this.categoriesForeignKeyName,
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onDelete: 'NO ACTION',
          }),
        ],
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'name',
            type: 'VARCHAR2(60)',
          }),
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
          new TableColumn({
            name: 'brand_id',
            type: 'NUMBER',
            foreignKeyConstraintName: this.brandsForeignKeyName,
          }),
          new TableColumn({
            name: 'category_id',
            type: 'NUMBER',
            foreignKeyConstraintName: this.categoriesForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
