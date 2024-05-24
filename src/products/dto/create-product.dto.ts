import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { CreateProductVariationDTO } from './create-product-variation.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsString()
  @IsNotEmpty()
  brandId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(Object.values(Gender))
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @Min(0)
  volume: number;

  @IsObject({ each: true })
  @IsOptional()
  variations: CreateProductVariationDTO[] = [];
}
