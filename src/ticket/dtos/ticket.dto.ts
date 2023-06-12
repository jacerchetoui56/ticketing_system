import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class UpdateTicketDto extends CreateTicketDto {}
