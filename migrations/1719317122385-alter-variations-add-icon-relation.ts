import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterVariationsAddIconRelation1719317122385
  implements MigrationInterface
{
  private readonly tableName = 'product_variations';
  private readonly attachmentForeignKeyName = 'FK_variation_icon_to_attachment';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn({
        name: 'icon_id',
        type: 'CHAR(36)',
        isNullable: true,
        foreignKeyConstraintName: this.attachmentForeignKeyName,
      }),
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        name: this.attachmentForeignKeyName,
        columnNames: ['icon_id'],
        referencedColumnNames: ['id'],
        referencedTableName: this.tableName,
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      this.tableName,
      this.attachmentForeignKeyName,
    );
    await queryRunner.dropColumn(this.tableName, this.attachmentForeignKeyName);
  }
}
