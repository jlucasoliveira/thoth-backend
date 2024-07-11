import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateProductVariationDTO {
  @IsString()
  @IsOptional()
  @Length(0, 60)
  variation: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 15)
  externalCode: string;

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
}
