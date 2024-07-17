import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { Gender } from '@/types/gender';

export class CreateProductVariationDTO {
  @IsString()
  @IsOptional()
  @Length(0, 60)
  variation: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 15)
  externalCode: string;

  @IsEnum(Object.values(Gender))
  @IsNotEmpty()
  gender: Gender;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  volume?: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsUUID('4')
  @IsOptional()
  iconId?: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  barCode?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @IsArray()
  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  categories: number[];
}
