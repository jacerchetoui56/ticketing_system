import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class AddAgentToTeamDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  agentId: number;
}

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  fieldId: number;
}
