import { generateBaseColumns } from '@/utils/migrations/base-columns';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateBankAccounts1722953411713 implements MigrationInterface {
  private readonly tableName = 'bank_accounts';
  private readonly foreignKeyName = 'FK_accounts_to_user';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.foreignKeyName,
            columnNames: ['owner_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
          }),
        ],
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'name',
            type: 'VARCHAR2(30)',
          }),
          new TableColumn({
            name: 'agency',
            type: 'VARCHAR2(10)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'account_number',
            type: 'VARCHAR2(15)',
            isNullable: true,
          }),
          new TableColumn({
            name: 'owner_id',
            type: 'CHAR(36)',
            isNullable: true,
            foreignKeyConstraintName: this.foreignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
