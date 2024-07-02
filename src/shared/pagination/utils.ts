import { Filter } from './pageOptions.dto';
import { WhereClause } from './filters';
import { FilterParser } from './filter-parser';

export function parseFilterIntoQueryWhere<EntityType>(
  filter: Filter<EntityType>,
): WhereClause<EntityType> {
  if (!filter) return {};

  const where = new FilterParser(filter).generateQuery();

  return where;
}

export function parseSortQueryParam<SortStringType extends string>(
  sort = '-createdAt' as SortStringType,
): Record<SortStringType, 'asc' | 'desc'> {
  return {
    [sort.replace(/^-/, '')]: /^-/.test(sort) ? 'desc' : 'asc',
  } as Record<SortStringType, 'asc' | 'desc'>;
}
