import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  confirmPassword: string;
}
