import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from "class-validator";
import { Exclude } from "class-transformer";
import { Roles } from "@prisma/client";

export class UserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @Exclude()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty()
  joined_at: Date;

  @ApiProperty()
  teamId?: number | null; // Mark it as optional if it can be null

  @Exclude()
  role: Roles;

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CustomerSignupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class CreateAgentDto extends CustomerSignupDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  teamId: number;
}

export class CreateAdminDto extends CustomerSignupDto {}
export class CreateSuperAdminDto extends CreateAdminDto {}
