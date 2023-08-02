import { HttpStatus } from "@nestjs/common/enums";
import { ApiResponseOptions } from "@nestjs/swagger";
import { DEFAULT_RESPONSE } from "src/shared/constants/swagger-docs";
import { TicketResponseDto } from "../dtos/ticket.dto";

export const ALL_TICKETS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [TicketResponseDto],
    status: HttpStatus.OK,
    description: "All tickets",
  },
];
export const WAITING_TICKETS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [TicketResponseDto],
    status: HttpStatus.OK,
    description: "Waiting Tickets",
  },
];
export const PENDING_TICKETS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [TicketResponseDto],
    status: HttpStatus.OK,
    description: "Pending tickets",
  },
];
export const REOPEN_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: TicketResponseDto,
    status: HttpStatus.OK,
    description: "Reopen ticket Successfully",
  },
];

export const ASSIGN_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    status: HttpStatus.OK,
    description: "Assign ticket Successfully",
  },
];

export const GET_COSTOMER_TICKETS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [TicketResponseDto],
    status: HttpStatus.OK,
    description: "Customer tickets",
  },
];
export const CREATE_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: TicketResponseDto,
    status: HttpStatus.CREATED,
    description: "Ticket created Successfully",
  },
];

export const GET_AGENT_TICKETS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [TicketResponseDto],
    status: HttpStatus.OK,
    description: "Agent Tickets",
  },
];

export const CANCEL_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    status: HttpStatus.OK,
    description: "Ticket Canceled Successfully",
  },
];

export const UPDATE_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: TicketResponseDto,
    status: HttpStatus.OK,
    description: "Ticket Updated Successfully",
  },
];

export const ANSWER_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    status: HttpStatus.OK,
    description: "Ticket Answered Successfully",
  },
];

export const RATE_TICKET_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: TicketResponseDto,
    status: HttpStatus.OK,
    description: "Ticket Rated Successfully",
  },
];
