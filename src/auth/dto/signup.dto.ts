import { Role } from '@prisma/client';
import { IsNotEmpty, IsEmail, IsStrongPassword, IsString, IsOptional, IsEnum } from 'class-validator';
import { PasswordConfig } from '../constants';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsOptional()
  role: keyof typeof Role;

  @IsStrongPassword(PasswordConfig)
  @IsNotEmpty()
  password: string;
}
