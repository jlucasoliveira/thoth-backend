import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { generateBaseColumns } from '@/utils/migrations/base-columns';

export class CreateLocationsTable1719255511200 implements MigrationInterface {
  private readonly tableName = 'locations';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'name',
            type: 'VARCHAR2(20)',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
