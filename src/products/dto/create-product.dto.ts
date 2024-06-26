import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { CreateProductVariationDTO } from './create-product-variation.dto';
import { Gender } from '@/types/gender';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 60)
  name: string;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsNumber()
  brandId: number;

  @IsNumber()
  categoryId: number;

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
