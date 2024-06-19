import { validate } from 'class-validator';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { parseFilterIntoQueryWhere, parseSortQueryParam } from './filters';
import { PageOptionDto } from './pageOptions.dto';

@Injectable()
export class FilterPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) return {};

    const filter = new PageOptionDto();
    filter.where = metadata.data in value ? value[metadata.data] : value;
    await validate(filter);

    return parseFilterIntoQueryWhere(value);
  }
}

@Injectable()
export class SortPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value !== undefined) {
      const filter = new PageOptionDto();
      filter.sort = metadata.data ? value[metadata.data] : value;
      await validate(filter);
    }

    return parseSortQueryParam(value);
  }
}

@Injectable()
export class IncludePipe implements PipeTransform {
  convertIntoBoolean(obj: any): Record<string, boolean | object> {
    const values = Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'string')
        if (['true', 'false'].includes(value)) return [key, value === 'true'];
        else return [key, value];

      return [key, this.convertIntoBoolean(value)];
    });

    return Object.fromEntries(values);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, _metadata: ArgumentMetadata) {
    return this.convertIntoBoolean(value);
  }
}
