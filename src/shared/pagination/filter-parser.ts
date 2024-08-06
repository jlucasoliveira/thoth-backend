import {
  And,
  Between,
  Equal,
  FindOptionsWhere,
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
import { BadRequestException } from '@nestjs/common';
import { Filter, FilterOperator } from './pageOptions.dto';

const labelConverter = ['string', 'number', 'date'] as const;
type LabelConverter = (typeof labelConverter)[number];

export class FilterParser<T> {
  private query: FindOptionsWhere<T> | Array<FindOptionsWhere<T>>;

  asNumber(input: any, asTarget = false) {
    const number = Number(input);
    if (isNaN(number) && !asTarget)
      throw new BadRequestException(`${input} is not a number`);

    return number;
  }

  asDate(input: any, asTarget = false) {
    const asDate = new Date(input);
    if (asDate.toString() === 'Invalid Date' && !asTarget)
      throw new BadRequestException(`${input} is a invalid date format`);

    return asDate;
  }

  convert(input: any): any {
    if (Array.isArray(input)) return input.map((value) => this.convert(value));

    if (typeof input === 'string') {
      const [value, caster] = input.split(':');

      if (
        caster !== undefined &&
        labelConverter.includes(caster as LabelConverter)
      ) {
        if (caster === 'string') return value.toString();
        else if (caster === 'number') return this.asNumber(value);
        else if (caster === 'date') return this.asDate(value);
      }
    }

    const number = Number(input);
    if (!isNaN(number)) return number;

    const asDate = new Date(input);
    if (asDate.toString() !== 'Invalid Date') return asDate;

    return input;
  }

  constructor(private readonly filter?: Filter<T>) {
    this.query = [];
  }

  createEquals(value: T[keyof T]) {
    return Equal(this.convert(value));
  }

  createNotEquals(value: T[keyof T]) {
    return Not(this.convert(value));
  }

  createContains(value: T[keyof T]) {
    return Like(`%${this.convert(value)}%`);
  }

  createInsensitiveContains(value: T[keyof T]) {
    return ILike(`%${this.convert(value)}%`);
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

  private buildQuery(filter: FilterOperator<T>): FindOptionsWhere<T> {
    const whereEntries = Object.entries(filter).map(([attr, filter]) => {
      const [key, value] = Object.entries(filter)[0];
      const parser = this.parserFactory(
        key as keyof FilterOperator<T[keyof T]>,
      );

      const result = parser
        ? parser(value as any)
        : this.createNestedQuery({ [key]: value } as Filter<T[keyof T]>);

      return [attr, result];
    });

    return Object.fromEntries(whereEntries);
  }

  private prepareFilter() {
    if (Array.isArray(this.filter) || this.filter === undefined)
      return this.filter;

    const keys = Object.keys(this.filter);

    if (keys.length <= 1) return this.filter;

    const keysAsNumber = keys.reduce(
      (acc, cur) => (isNaN(+cur) ? acc : acc + 1),
      0,
    );

    if (keys.length === keysAsNumber) return this.filter;

    const globalFilters = [];
    const commonFilters: Filter<T> = {};
    Object.entries(this.filter).forEach(([key, filter]) => {
      if (isNaN(+key)) commonFilters[key] = filter;
      else globalFilters.push(filter);
    });

    return globalFilters.map((filter) => ({
      ...commonFilters,
      ...filter,
    }));
  }

  generateQuery(): FindOptionsWhere<T> | Array<FindOptionsWhere<T>> {
    const filters = this.prepareFilter();

    if (Array.isArray(filters)) {
      if (filters.length > 0)
        this.query = filters.map((filter) => this.buildQuery(filter));
    } else if (filters) {
      this.query = this.buildQuery(filters);
    }

    return this.query;
  }
}
