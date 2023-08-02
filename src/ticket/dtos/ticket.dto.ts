import { ApiProperty } from "@nestjs/swagger";
import { Rating, TicketPriority, TicketState } from "@prisma/client";
import { Exclude, Expose, Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserDTO } from "src/auth/dtos/auth.dto";

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

export const TicketResponse = {
  id: true,
  customer: {
    select: { id: true, name: true },
  },
  question: true,
  agent: {
    select: { id: true, name: true },
  },
  rating: true,
  state: true,
  answer: {
    select: {
      answer: true,
    },
  },
};

export class TicketResponseDto {
  @ApiProperty()
  id: number;

  @Exclude()
  @ApiProperty()
  question: string;

  @ApiProperty({ enum: TicketPriority })
  priority: TicketPriority;

  @ApiProperty({ enum: TicketState })
  state: TicketState;

  @Exclude()
  agentId: number;

  @Exclude()
  customerId: number;

  @ApiProperty({ enum: Rating })
  rating: Rating;

  @ApiProperty()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @ApiProperty({ type: () => UserDTO })
  @Expose()
  @Type(() => UserDTO)
  agent: UserDTO;

  @ApiProperty({ type: () => UserDTO })
  @Expose()
  @Type(() => UserDTO)
  customer: UserDTO;

  constructor(partial: Partial<TicketResponseDto>) {
    Object.assign(this, partial);
  }
}
