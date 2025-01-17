import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class StockResumeDTO {
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @Transform((params) => params.value === 'true')
  lowStock?: boolean;
}
