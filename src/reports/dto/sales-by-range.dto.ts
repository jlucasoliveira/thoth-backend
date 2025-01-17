import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SalesByDateRangeDTO {
  @IsDateString({ strict: true })
  startDate: string;

  @IsDateString({ strict: true })
  endDate: string;

  @IsOptional()
  @IsUUID('4')
  @IsString()
  clientId?: string;

  @IsOptional()
  @IsUUID('4')
  @IsString()
  userId?: string;

  @IsString()
  @IsOptional()
  filter?: 'ne';

  @IsOptional()
  @IsNumberString(undefined, { each: true })
  brands?: number[];

  @Type(() => Boolean)
  @Transform((o) => o.value === 'true')
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;
}
