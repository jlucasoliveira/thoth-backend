import { IsOptional, IsString } from 'class-validator';

export class CreateBankAccountDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  agency?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  ownerId?: string;
}
