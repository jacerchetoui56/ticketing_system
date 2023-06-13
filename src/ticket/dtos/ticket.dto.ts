import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class UpdateTicketDto extends CreateTicketDto {}

export class TicketAnswerDto {
  @IsNotEmpty()
  @IsString()
  answer: string;
}

export class AssignToAgentDto {
  @IsNumber()
  agentId: number;
}
