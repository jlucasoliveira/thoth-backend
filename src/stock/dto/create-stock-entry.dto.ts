import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { StockKind } from '../constants';

export class CreateStockEntryDto {
  @IsDateString()
  entryDate: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  costPrice?: number;

  @IsDateString()
  expirationDate: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(StockKind)
  kind: StockKind;
}
