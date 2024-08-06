import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  value: number;

  @IsString()
  @IsUUID()
  clientId: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @IsNumber()
  accountId: number;
}
