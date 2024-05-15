import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductVariationDTO {
  @IsString()
  @IsNotEmpty()
  variation: string;

  @IsString()
  @IsNotEmpty()
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
  barCode?: string;
}
