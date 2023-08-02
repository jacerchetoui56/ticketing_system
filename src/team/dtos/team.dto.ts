import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { Expose, Type } from "class-transformer";

export class Field {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;
}

export class Team {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @Expose()
  @Type(() => Field)
  field: Field;
}

export class AddAgentToTeamDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  agentId: number;
}

export class CreateFieldDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  fieldId: number;
}
