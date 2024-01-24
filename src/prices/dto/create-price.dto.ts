import { IsNumber, Min } from 'class-validator';

export class CreatePriceDto {
  @IsNumber()
  @Min(0)
  price: number;
}
