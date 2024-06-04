import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClientDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  email: string;
}
