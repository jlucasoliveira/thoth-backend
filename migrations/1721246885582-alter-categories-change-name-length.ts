import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCategoriesChangeNameLength1721246885582
  implements MigrationInterface
{
  private readonly tableName = 'categories';
  private readonly columnName = 'name';

  private escape(queryRunner: QueryRunner, value: string): string {
    return queryRunner.connection.driver.escape(value);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE ${this.escape(
      queryRunner,
      this.tableName,
    )} MODIFY ${this.escape(queryRunner, this.columnName)} VARCHAR2(60)`;
    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE ${this.escape(
      queryRunner,
      this.tableName,
    )} MODIFY ${this.escape(queryRunner, this.columnName)} VARCHAR2(30)`;
    await queryRunner.query(query);
  }
}
