import { IsNumber, Min } from 'class-validator';

export class UpdateStockDTO {
  @IsNumber()
  @Min(0)
  minQuantity: number;
}
