import { validate } from 'class-validator';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { parseFilterIntoQueryWhere, parseSortQueryParam } from './filters';
import { PageOptionDto } from './pageOptions.dto';

@Injectable()
export class FilterPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) return;

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
