import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
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

export class CustomerSignup {
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

export class CreateAgentDto extends CustomerSignup {
  @IsNotEmpty()
  @IsString()
  @IsNumber()
  teamId: number;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
