import { Filter } from './pageOptions.dto';

type QueryKey =
  | 'equals'
  | 'in'
  | 'notIn'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'not';

type Query<Type> = Record<QueryKey, Type>;

type WhereClause<T> = {
  [key in keyof T]?: T[key] | Query<T[key]> | any;
};

export type OrderBy<Entity> = Record<keyof Entity, 'asc' | 'desc'>;

export type PageOptions<Entity> = {
  take: number;
  skip: number;
  orderBy: OrderBy<Entity>;
  where: WhereClause<Entity>;
};

function convert(input: any): any {
  const number = Number(input);
  if (!isNaN(number)) return number;

  const inDate = new Date(input);
  if (inDate.toString() !== 'Invalid Date') return inDate;

  return input;
}

export function parseFilterIntoQueryWhere<EntityType>(
  filter: Filter<EntityType>,
): WhereClause<EntityType> {
  const where: WhereClause<EntityType> = {};

  if (!filter) return where;

  Object.keys(filter).forEach((key) => {
    const filterValue = filter[key];
    const operator = Object.keys(filterValue)[0];

    if (Array.isArray(filterValue) && !['between', 'or'].includes(operator))
      return;

    switch (operator) {
      case 'eq':
        where[key] = convert(filterValue['eq']);
        break;
      case 'ne':
        where[key] = { not: convert(filterValue['ne']) };
        break;
      case 'like':
        where[key] = { contains: convert(filterValue['like']) };
        break;
      case 'ilike':
        where[key] = {
          contains: convert(filterValue['ilike']),
          mode: 'insensitive',
        };
        break;
      case 'between':
        const [start, end] = filterValue['between'];
        where[key] = { gte: convert(start), lte: convert(end) };
        break;
      case 'in':
        where[key] = { in: convert(filterValue['in']) };
        break;
      case 'or':
        const orFilters = filterValue['or'];
        where['OR'] = orFilters.map((orFilter) =>
          parseFilterIntoQueryWhere({ [key]: orFilter }),
        );
        break;
      case 'gte':
        where[key] = { gte: convert(filterValue['gte']) };
        break;
      case 'lte':
        where[key] = { lte: convert(filterValue['lte']) };
        break;
      case 'gt':
        where[key] = { gt: convert(filterValue['gt']) };
        break;
      case 'lt':
        where[key] = { lt: convert(filterValue['lt']) };
        break;
      default:
        where[key] = parseFilterIntoQueryWhere(filterValue);
        break;
    }
  });

  return where;
}

export function parseSortQueryParam<SortStringType extends string>(
  sort = '-createdAt' as SortStringType,
): Record<SortStringType, 'asc' | 'desc'> {
  return {
    [sort.replace(/^-/, '')]: /^-/.test(sort) ? 'desc' : 'asc',
  } as Record<SortStringType, 'asc' | 'desc'>;
}
