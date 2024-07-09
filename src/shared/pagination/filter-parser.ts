import {
  And,
  Between,
  Equal,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Or,
} from 'typeorm';
import { Filter, FilterOperator } from './pageOptions.dto';
import { WhereClause } from './filters';

export class FilterParser<T> {
  private query: WhereClause<T>;

  convert(input: any): any {
    const number = Number(input);
    if (!isNaN(number)) return number;

    const inDate = new Date(input);
    if (inDate.toString() !== 'Invalid Date') return inDate;

    if (Array.isArray(input)) return input.map((value) => this.convert(value));

    return input;
  }

  constructor(private readonly filter?: Filter<T>) {
    this.query = {};
  }

  createEquals(value: T[keyof T]) {
    return Equal(this.convert(value));
  }

  createNotEquals(value: T[keyof T]) {
    return Not(this.convert(value));
  }

  createContains(value: T[keyof T]) {
    return Like(this.convert(value));
  }

  createInsensitiveContains(value: T[keyof T]) {
    return ILike(this.convert(value));
  }

  createGreaterThanEqual(value: T[keyof T]) {
    return MoreThanOrEqual(this.convert(value));
  }

  createLessThanEqual(value: T[keyof T]) {
    return LessThanOrEqual(this.convert(value));
  }

  createGreaterThan(value: T[keyof T]) {
    return MoreThan(this.convert(value));
  }

  createLessThan(value: T[keyof T]) {
    return LessThan(this.convert(value));
  }

  createBetween([start, end]: [T[keyof T], T[keyof T]]) {
    return Between(this.convert(start), this.convert(end));
  }

  createInterval(interval: T[keyof T] | Array<T[keyof T]>) {
    if (!Array.isArray(interval)) interval = [interval];
    return In(this.convert(interval));
  }

  createDisjunction(filters: Array<FilterOperator<T[keyof T]>>) {
    return Or(
      ...Object.entries(filters).map(([key, filter]) => {
        const parser = this.parserFactory(
          key as keyof FilterOperator<T[keyof T]>,
        );
        return parser(filter as any);
      }),
    );
  }

  createJunction(filters: Array<FilterOperator<T[keyof T]>>) {
    return And(
      ...Object.entries(filters).map(([key, filter]) => {
        const parser = this.parserFactory(
          key as keyof FilterOperator<T[keyof T]>,
        );
        return parser(filter as any);
      }),
    );
  }

  createNestedQuery(value: Filter<T[keyof T]>) {
    return new FilterParser(value).generateQuery();
  }

  private parserFactory(key: keyof FilterOperator<T[keyof T]>) {
    const factories = {
      eq: this.createEquals.bind(this),
      ne: this.createNotEquals.bind(this),
      like: this.createContains.bind(this),
      ilike: this.createInsensitiveContains.bind(this),
      between: this.createBetween.bind(this),
      lt: this.createLessThan.bind(this),
      gt: this.createGreaterThan.bind(this),
      lte: this.createLessThanEqual.bind(this),
      gte: this.createGreaterThanEqual.bind(this),
      in: this.createInterval.bind(this),
      and: this.createJunction.bind(this),
      or: this.createDisjunction.bind(this),
    };

    const parser = factories[key as keyof typeof factories];

    return parser;
  }

  generateQuery(): WhereClause<T> {
    if (this.filter) {
      Object.entries(this.filter).forEach(([attr, filter]) => {
        const [key, value] = Object.entries(filter)[0];
        const parser = this.parserFactory(
          key as keyof FilterOperator<T[keyof T]>,
        );

        this.query[attr] = parser
          ? parser(value as any)
          : this.createNestedQuery({ [key]: value } as Filter<T[keyof T]>);
      });
    }

    return this.query;
  }
}
