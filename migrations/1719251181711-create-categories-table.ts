import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { generateBaseColumns } from '@/utils/migrations/base-columns';

export class CreateCategoriesTable1719251181711 implements MigrationInterface {
  private readonly tableName = 'categories';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'name',
            type: 'VARCHAR2(30)',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
