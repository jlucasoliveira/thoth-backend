import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CreateProductVariationDTO } from './create-product-variation.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 60)
  name: string;

  @IsNumber()
  brandId: number;

  @IsObject({ each: true })
  @IsOptional()
  variations: CreateProductVariationDTO[] = [];
}
