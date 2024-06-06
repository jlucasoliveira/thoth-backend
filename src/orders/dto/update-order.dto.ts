import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateOrderDTO {
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @Min(0)
  @IsNumber()
  @IsOptional()
  totalPaid?: number;

  @IsDateString()
  @IsOptional()
  paidDate?: string;
}
