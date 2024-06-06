import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { CreateOrderItemDTO } from './create-order-item.dto';

export class CreateOrderDTO {
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsNumber()
  @IsOptional()
  totalPaid?: number;

  @IsUUID('4')
  @IsString()
  @IsOptional()
  userId?: string;

  @IsArray()
  @MinLength(1)
  @IsObject({ each: true })
  items: CreateOrderItemDTO[];
}
