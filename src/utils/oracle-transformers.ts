import { ValueTransformer } from 'typeorm';

export enum OracleBoolean {
  true = '1',
  false = '0',
}

export function convertIntoBoolean(resource: string): ValueTransformer {
  return {
    to(value) {
      if (typeof value === 'boolean')
        return value ? OracleBoolean.true : OracleBoolean.false;
      throw new Error(
        `Invalid value (${value}, '${typeof value}') on ${resource}`,
      );
    },
    from: (value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value === OracleBoolean.true;
      return value;
    },
  };
}

export function padIntoLength(length = 2): ValueTransformer {
  return {
    from: (value: string) => value.trim(),
    to: (value: string) => value.padEnd(length, ' '),
  };
}
