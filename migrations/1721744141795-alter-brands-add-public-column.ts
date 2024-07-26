import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { OracleBoolean } from '@/utils/oracle-transformers';

export class AlterBrandsAddPublicColumn1721744141795
  implements MigrationInterface
{
  private readonly tableName = 'brands';
  private readonly columnName = 'is_public';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: this.columnName,
        type: 'CHAR(1)',
        default: OracleBoolean.false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.columnName);
  }
}
