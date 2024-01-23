import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  externalCode: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsString()
  @IsOptional()
  barCode: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  volume: number;

  @IsString()
  icon: string;

  @IsString()
  @IsNotEmpty()
  brandId: string;
}
