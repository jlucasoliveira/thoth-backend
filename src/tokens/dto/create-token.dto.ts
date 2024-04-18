import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  device?: string;

  @IsString()
  @IsOptional()
  os?: string;
}
