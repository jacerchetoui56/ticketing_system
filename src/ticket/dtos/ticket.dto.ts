import { ApiProperty } from "@nestjs/swagger";
import { Rating } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
  @ApiProperty({ description: "The question of the ticket" })
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class UpdateTicketDto extends CreateTicketDto {}

export class TicketAnswerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  answer: string;
}

export class AssignToAgentDto {
  @ApiProperty()
  @IsNumber()
  agentId: number;
}

export class RateDto {
  @ApiProperty({ enum: Rating, name: "rating" })
  @IsEnum(Rating)
  @IsNotEmpty()
  rating: Rating;
}
