import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterVariationAddExternalCodeUniqueConstraint1720956916147
  implements MigrationInterface
{
  private readonly tableName = 'product_variations';
  private readonly constraintName = 'unique_external_code';

  private escape(queryRunner: QueryRunner, value: string): string {
    return queryRunner.connection.driver.escape(value);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE ${this.escape(
      queryRunner,
      this.tableName,
    )} ADD CONSTRAINT ${this.escape(
      queryRunner,
      this.constraintName,
    )} UNIQUE (${this.escape(queryRunner, 'external_code')})`;

    await queryRunner.query(query);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const query = `ALTER TABLE ${this.escape(
      queryRunner,
      this.tableName,
    )} DROP CONSTRAINT ${this.escape(queryRunner, this.constraintName)}`;

    await queryRunner.query(query);
  }
}
