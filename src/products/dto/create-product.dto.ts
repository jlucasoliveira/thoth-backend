import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Gender } from '@prisma/client';

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

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
