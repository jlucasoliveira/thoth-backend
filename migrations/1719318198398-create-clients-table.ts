import {
  generateBaseColumns,
  generatePhoneNumberColumn,
  generateUUIDCheck,
} from '@/utils/migrations/base-columns';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateClientsTable1719318198398 implements MigrationInterface {
  private readonly tableName = 'clients';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        checks: [
          generateUUIDCheck(queryRunner.connection.driver.escape('id'), 'id'),
        ],
        columns: [
          ...generateBaseColumns(),
          generatePhoneNumberColumn(),
          new TableColumn({
            name: 'name',
            type: 'VARCHAR2(60)',
          }),
          new TableColumn({
            name: 'email',
            type: 'VARCHAR2(60)',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
