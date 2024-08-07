import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ArrayMinSize,
  ValidateNested,
  ValidateIf,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDTO } from './create-order-item.dto';

export class CreateOrderDTO {
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @ValidateIf((o) => o.paid)
  installments?: number;

  @IsBoolean()
  @IsOptional()
  retainedStock?: boolean = false;

  @IsNumber()
  @IsOptional()
  totalPaid?: number;

  @IsUUID('4')
  @IsString()
  @IsOptional()
  clientId?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items: CreateOrderItemDTO[];
}
