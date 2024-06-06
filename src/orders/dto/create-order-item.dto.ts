import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDTO {
  @Min(0)
  @IsNumber()
  quantity: number;

  @IsUUID('4')
  @IsString()
  @IsNotEmpty()
  variationId: string;
}
