import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@prisma/client";
import { Request } from "express";
import { AllowedRoles } from "src/auth/decorators/role.decorator";
import { AuthGuard, IUserFromToken } from "src/auth/guards/auth.guard";
import { RoleGuard } from "src/auth/guards/role.guard";
import {
  AssignToAgentDto,
  CreateTicketDto,
  RateDto,
  TicketAnswerDto,
  TicketResponse,
  TicketResponseDto,
  UpdateTicketDto,
} from "./dtos/ticket.dto";
import { TicketOwnershipGuard } from "./guards/ticketownership.guard";
import { TicketService } from "./ticket.service";
import { TicketResponseInterceptor } from "./interceptors/TicketResponse.interceptor";
import {
  ALL_TICKETS_RESPONSE,
  ANSWER_TICKET_RESPONSE,
  ASSIGN_TICKET_RESPONSE,
  CANCEL_TICKET_RESPONSE,
  CREATE_TICKET_RESPONSE,
  GET_AGENT_TICKETS_RESPONSE,
  GET_COSTOMER_TICKETS_RESPONSE,
  PENDING_TICKETS_RESPONSE,
  RATE_TICKET_RESPONSE,
  REOPEN_TICKET_RESPONSE,
  UPDATE_TICKET_RESPONSE,
  WAITING_TICKETS_RESPONSE,
} from "./constants/swagger-docs";
import { ResponseDoc } from "src/shared/decorators/response-docs.decorator";

class Nested {
  @ApiProperty()
  age: number;
  @ApiProperty()
  parent: string;
}

@Controller("ticket")
@ApiTags("Tickets")
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get("all")
  @AllowedRoles(Roles.admin)
  @ResponseDoc(ALL_TICKETS_RESPONSE)
  getAllTickets() {
    return this.ticketService.getAllTickets();
  }

  @Get("waiting")
  @AllowedRoles(Roles.admin)
  @ResponseDoc(WAITING_TICKETS_RESPONSE)
  getWaitingTickets() {
    return this.ticketService.getWaitingTickets();
  }

  @Post("/:id/reopen")
  @AllowedRoles(Roles.admin, Roles.customer)
  @UseGuards(TicketOwnershipGuard)
  @ResponseDoc(REOPEN_TICKET_RESPONSE)
  reopenTicket(@Param("id", ParseIntPipe) ticketId: number) {
    return this.ticketService.reopenTicket(ticketId);
  }

  @Get("pending")
  @AllowedRoles(Roles.admin)
  @ResponseDoc(PENDING_TICKETS_RESPONSE)
  getPendingTickets() {
    return this.ticketService.getPendingTickets();
  }

  @Post(":id/assign")
  @AllowedRoles(Roles.admin)
  @ResponseDoc(ASSIGN_TICKET_RESPONSE)
  assignTicketToAgent(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() assignToAgent: AssignToAgentDto,
  ) {
    return this.ticketService.assignToAgent(ticketId, assignToAgent.agentId);
  }

  @Get("customer")
  @AllowedRoles(Roles.customer, Roles.admin)
  @ResponseDoc(GET_COSTOMER_TICKETS_RESPONSE)
  getCustomerTickets(@Req() request: Request) {
    const user: IUserFromToken = request["user"];
    return this.ticketService.getCustomerTickets(user.id);
  }

  @Post("new")
  @AllowedRoles(Roles.customer, Roles.admin)
  @ResponseDoc(CREATE_TICKET_RESPONSE)
  createTicket(@Body() ticket: CreateTicketDto, @Req() request: Request) {
    const user: IUserFromToken = request["user"];
    return this.ticketService.createTicket(ticket, user.id);
  }

  @Get("agent/:id")
  @AllowedRoles(Roles.agent, Roles.admin)
  @UseGuards(TicketOwnershipGuard)
  @ResponseDoc(GET_AGENT_TICKETS_RESPONSE)
  getAgentTickets(@Param("id", ParseIntPipe) agentId: number) {
    return this.ticketService.getAgentTickets(agentId);
  }

  @Delete(":id/cancel")
  @AllowedRoles(Roles.customer, Roles.admin)
  @UseGuards(TicketOwnershipGuard)
  @ResponseDoc(CANCEL_TICKET_RESPONSE)
  cancelTicket(@Param("id", ParseIntPipe) ticketId: number) {
    return this.ticketService.cancelTicket(ticketId);
  }

  @Patch(":id")
  @AllowedRoles(Roles.customer, Roles.admin)
  @UseGuards(TicketOwnershipGuard)
  @ResponseDoc(UPDATE_TICKET_RESPONSE)
  updateTicket(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() updatedTicket: UpdateTicketDto,
  ) {
    return this.ticketService.updateTicketQuestion(ticketId, updatedTicket);
  }

  @Post(":id/answer")
  @AllowedRoles(Roles.admin, Roles.agent)
  @UseGuards(TicketOwnershipGuard)
  @ResponseDoc(ANSWER_TICKET_RESPONSE)
  answerTicket(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() ticketAnswer: TicketAnswerDto,
  ) {
    return this.ticketService.answerTicket(ticketId, ticketAnswer);
  }

  @Post(":id/rating")
  @AllowedRoles(Roles.customer)
  @UseGuards(TicketOwnershipGuard)
  @ResponseDoc(RATE_TICKET_RESPONSE)
  rateTicket(
    @Body() rating: RateDto,
    @Param("id", ParseIntPipe) ticketId: number,
  ) {
    return this.ticketService.rateTicket(ticketId, rating);
  }

  @Get("ratings")
  getRatings() {
    return this.ticketService.getRatings();
  }
}
