import { TableCheck, TableColumn } from 'typeorm';

export function generateUUIDCheck(column: string, columnName = column) {
  return new TableCheck({
    columnNames: [columnName],
    expression: `REGEXP_LIKE(${column}, '^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$')`,
  });
}

export const baseColumns: TableColumn[] = [
  new TableColumn({
    name: 'created_at',
    type: 'TIMESTAMP',
    default: 'CURRENT_TIMESTAMP',
  }),
  new TableColumn({
    name: 'updated_at',
    type: 'TIMESTAMP',
    default: 'CURRENT_TIMESTAMP',
  }),
  new TableColumn({
    name: 'deleted_at',
    type: 'TIMESTAMP',
    isNullable: true,
  }),
];

export function generateBaseColumns(uuidAsId = true) {
  return baseColumns.concat(
    new TableColumn({
      name: 'id',
      type: uuidAsId ? 'CHAR(36)' : 'NUMBER',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: uuidAsId ? 'uuid' : 'increment',
    }),
  );
}

export function generatePhoneNumberColumn(isNullable = true) {
  return new TableColumn({
    isNullable,
    name: 'phone_number',
    type: 'VARCHAR2(20)',
  });
}
