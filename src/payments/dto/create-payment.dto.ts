import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDTO {
  @IsNumber()
  value: number;

  @IsString()
  @IsUUID()
  clientId: string;
}
