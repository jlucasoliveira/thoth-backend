import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderItemDTO {
  @Min(0)
  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  variationId: string;
}
