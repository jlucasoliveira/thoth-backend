import { FindOptionsRelations, FindOptionsWhere } from 'typeorm';

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

export type WhereClause<T> = {
  [key in keyof T]?: T[key] | Query<T[key]> | any;
};

export type OrderBy<Entity> = Record<keyof Entity, 'asc' | 'desc'>;

export type PageOptions<Entity> = {
  take?: number;
  skip?: number;
  order?: OrderBy<Entity>;
  where: FindOptionsWhere<Entity>;
  relations?: FindOptionsRelations<Entity>;
};
