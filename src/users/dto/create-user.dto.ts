import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 60)
  password: string;

  @IsString()
  @Length(2, 60)
  name: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  isAdmin: boolean;
}
