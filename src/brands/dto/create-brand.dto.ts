import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNumber()
  profitRate: number;

  @IsBoolean()
  @IsOptional()
  isPublic = true;
}
