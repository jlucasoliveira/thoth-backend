import { IsNotEmpty, IsString, Length, ValidateIf } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @ValidateIf((o: ChangePasswordDTO, value: string) => o.newPassword === value)
  confirmPassword: string;
}
