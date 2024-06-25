import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';
import { OracleBoolean } from '@/utils/oracle-transformers';
import {
  generateBaseColumns,
  generatePhoneNumberColumn,
  generateUUIDCheck,
} from '@/utils/migrations/base-columns';

export class CreateUserTable1719230745081 implements MigrationInterface {
  private readonly tableName = 'users';

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
            name: 'password',
            type: 'CHAR(60)',
          }),
          new TableColumn({
            name: 'name',
            type: 'VARCHAR2(60)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'username',
            type: 'VARCHAR2(20)',
            isUnique: true,
          }),
          new TableColumn({
            name: 'last_login',
            type: 'TIMESTAMP',
            isNullable: true,
          }),
          new TableColumn({
            name: 'is_admin',
            type: 'CHAR(1)',
            default: OracleBoolean.false,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
