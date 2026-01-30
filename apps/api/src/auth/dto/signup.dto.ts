import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
