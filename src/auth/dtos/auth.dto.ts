import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
} from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CustomerSignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class CreateAgentDto extends CustomerSignupDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  teamId: number;
}
