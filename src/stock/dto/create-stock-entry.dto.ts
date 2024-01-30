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
  costPrice: number;

  @IsDateString()
  expirationDate: string;

  @IsNumber()
  amount: number;

  @IsEnum(StockKind)
  kind: StockKind;

  @IsNumber()
  @Min(0)
  @IsOptional()
  newPrice: number;
}
