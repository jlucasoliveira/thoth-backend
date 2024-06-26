import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNumber()
  profitRate: number;
}
