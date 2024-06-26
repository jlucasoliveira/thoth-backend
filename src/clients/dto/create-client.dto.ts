import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateClientDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 60)
  name: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @Length(6, 60)
  email: string;
}
