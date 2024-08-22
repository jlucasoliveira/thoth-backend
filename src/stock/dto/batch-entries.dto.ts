import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { CreateStockEntryDto } from './create-stock-entry.dto';

export class EntryDTO extends OmitType(CreateStockEntryDto, ['newValue']) {
  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  variationId: string;
}

export class BatchEntriesDTO {
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => EntryDTO)
  entries: EntryDTO[];
}
