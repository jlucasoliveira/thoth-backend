import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  profitRate: number;
}
