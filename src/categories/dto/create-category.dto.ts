import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNumber()
  @IsOptional()
  brandId?: number;
}
