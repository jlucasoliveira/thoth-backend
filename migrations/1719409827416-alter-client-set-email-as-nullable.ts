import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterClientSetEmailAsNullable1719409827416
  implements MigrationInterface
{
  private readonly tableName = 'clients';
  private readonly columnDefinition = { name: 'email', type: 'VARCHAR2(60)' };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      this.columnDefinition.name,
      new TableColumn({ ...this.columnDefinition, isNullable: true }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      this.tableName,
      this.columnDefinition.name,
      new TableColumn({ ...this.columnDefinition, default: '' }),
    );
  }
}
