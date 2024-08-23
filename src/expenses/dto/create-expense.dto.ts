import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class CreateExpenseDTO {
  @IsNumber()
  brandId: number;

  @IsNumber()
  bankAccountId: number;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsBoolean()
  isPaid: boolean;
}
