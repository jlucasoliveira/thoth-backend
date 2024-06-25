import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import {
  generateBaseColumns,
  generateUUIDCheck,
} from '@/utils/migrations/base-columns';

export class CreateVariationsTable1719253350774 implements MigrationInterface {
  private readonly tableName = 'product_variations';
  private readonly productForeignKeyName = 'FK_variation_on_product';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        checks: [
          generateUUIDCheck(queryRunner.connection.driver.escape('id'), 'id'),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: this.productForeignKeyName,
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
            onDelete: 'CASCADE',
          }),
        ],
        columns: [
          ...generateBaseColumns(),
          new TableColumn({
            name: 'variation',
            type: 'VARCHAR2(60)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'external_code',
            type: 'VARCHAR2(15)',
          }),
          new TableColumn({
            name: 'bar_code',
            type: 'VARCHAR2(20)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'price',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'product_id',
            type: 'NUMBER',
            foreignKeyConstraintName: this.productForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
