import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';
import { OracleBoolean } from '@/utils/oracle-transformers';
import { generateBaseColumns } from '@/utils/migrations/base-columns';

export class CreateExpensesTable1724337114663 implements MigrationInterface {
  private readonly tableName = 'expenses';
  private readonly brandTableName = 'brands';
  private readonly accountTableName = 'bank_accounts';
  private readonly brandForeignKeyName = 'FK_expenses_brands';
  private readonly bankAccountsForeignKeyName = 'FK_expenses_bank_accounts';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        foreignKeys: [
          new TableForeignKey({
            name: this.brandForeignKeyName,
            columnNames: ['brand_id'],
            referencedColumnNames: ['id'],
            referencedTableName: this.brandTableName,
            onDelete: 'NO ACTION',
          }),
          new TableForeignKey({
            name: this.bankAccountsForeignKeyName,
            columnNames: ['account_id'],
            referencedColumnNames: ['id'],
            referencedTableName: this.accountTableName,
            onDelete: 'NO ACTION',
          }),
        ],
        columns: [
          ...generateBaseColumns(false),
          new TableColumn({
            name: 'value',
            type: 'FLOAT',
          }),
          new TableColumn({
            name: 'is_paid',
            type: 'CHAR(1)',
            default: OracleBoolean.false,
          }),
          new TableColumn({
            name: 'installments',
            type: 'NUMBER',
            default: 1,
          }),
          new TableColumn({
            name: 'brand_id',
            type: 'NUMBER',
            foreignKeyConstraintName: this.brandForeignKeyName,
          }),
          new TableColumn({
            name: 'account_id',
            type: 'NUMBER',
            foreignKeyConstraintName: this.bankAccountsForeignKeyName,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName, true, true, true);
  }
}
