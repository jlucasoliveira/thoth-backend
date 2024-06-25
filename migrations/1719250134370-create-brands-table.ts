import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { generateBaseColumns } from '@/utils/migrations/base-columns';

export class CreateBrandsTable1719250134370 implements MigrationInterface {
  private readonly tableName = 'brands';

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
          new TableColumn({
            name: 'profit_rate',
            type: 'FLOAT',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
