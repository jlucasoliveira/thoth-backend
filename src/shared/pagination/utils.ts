import { Filter } from './pageOptions.dto';
import { FilterParser } from './filter-parser';
import { FindOptionsWhere } from 'typeorm/browser';

export function parseFilterIntoQueryWhere<EntityType>(
  filter: Filter<EntityType>,
): FindOptionsWhere<EntityType> | Array<FindOptionsWhere<EntityType>> {
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
