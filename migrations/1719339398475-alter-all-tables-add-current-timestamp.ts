import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

const type = 'TIMESTAMP';

export class AlterAllTablesAddCurrentTimestamp1719339398475
  implements MigrationInterface
{
  private readonly tableNames = [
    'users',
    'brands',
    'categories',
    'orders',
    'order_items',
    'clients',
    'products',
    'product_variations',
    'stocks',
    'stock_entries',
    'stock_locations',
    'locations',
    'attachments',
    'attachments_sizes',
  ];
  private readonly default = 'CURRENT_TIMESTAMP';
  private readonly createdAtDefinition = { name: 'created_at', type };
  private readonly updatedAtDefinition = { name: 'updated_at', type };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.tableNames.map(
        async (tableName) =>
          await queryRunner.changeColumns(tableName, [
            {
              oldColumn: new TableColumn(this.createdAtDefinition),
              newColumn: new TableColumn({
                ...this.createdAtDefinition,
                default: this.default,
              }),
            },
            {
              oldColumn: new TableColumn(this.updatedAtDefinition),
              newColumn: new TableColumn({
                ...this.updatedAtDefinition,
                default: this.default,
              }),
            },
          ]),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      this.tableNames.map(
        async (tableName) =>
          await queryRunner.changeColumns(tableName, [
            {
              newColumn: new TableColumn(this.createdAtDefinition),
              oldColumn: new TableColumn({
                ...this.createdAtDefinition,
                default: this.default,
              }),
            },
            {
              newColumn: new TableColumn(this.updatedAtDefinition),
              oldColumn: new TableColumn({
                ...this.updatedAtDefinition,
                default: this.default,
              }),
            },
          ]),
      ),
    );
  }
}
