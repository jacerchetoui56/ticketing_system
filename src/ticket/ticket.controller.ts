import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { Roles } from "@prisma/client";
import { AllowedRoles } from "src/auth/decorators/role.decorator";
import { AuthGuard, IUserFromToken } from "src/auth/guards/auth.guard";
import { RoleGuard } from "src/auth/guards/role.guard";
import {
  AssignToAgentDto,
  CreateTicketDto,
  TicketAnswerDto,
  UpdateTicketDto,
} from "./dtos/ticket.dto";
import { TicketOwnershipGuard } from "./guards/ticketownership.guard";
import { TicketService } from "./ticket.service";

@Controller("ticket")
@UseGuards(AuthGuard, RoleGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get("all")
  @AllowedRoles(Roles.admin)
  getAllTickets() {
    return this.ticketService.getAllTickets();
  }

  @Get("waiting")
  @AllowedRoles(Roles.admin)
  getWaitingTickets() {
    return this.ticketService.getWaitingTickets();
  }

  @Post("/:id/reopen")
  @AllowedRoles(Roles.admin, Roles.customer)
  @UseGuards(TicketOwnershipGuard)
  reopenTicket(@Param("id", ParseIntPipe) ticketId: number) {
    return this.ticketService.reopenTicket(ticketId);
  }

  @Get("pending")
  @AllowedRoles(Roles.admin)
  getPendingTickets() {
    return this.ticketService.getPendingTickets();
  }

  @Post(":id/assign")
  @AllowedRoles(Roles.admin)
  assignTicketToAgent(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() assignToAgent: AssignToAgentDto,
  ) {
    return this.ticketService.assignToAgent(ticketId, assignToAgent.agentId);
  }

  @Get("customer")
  @AllowedRoles(Roles.customer, Roles.admin)
  getCustomerTickets(@Req() request: Request) {
    const user: IUserFromToken = request["user"];
    return this.ticketService.getCustomerTickets(user.id);
  }

  @Post("new")
  @AllowedRoles(Roles.customer, Roles.admin)
  createTicket(@Body() ticket: CreateTicketDto, @Req() request: Request) {
    const user: IUserFromToken = request["user"];
    return this.ticketService.createTicket(ticket, user.id);
  }

  @Get("agent/:id")
  @AllowedRoles(Roles.agent, Roles.admin)
  @UseGuards(TicketOwnershipGuard)
  getAgentTickets(@Param("id", ParseIntPipe) agentId: number) {
    return this.ticketService.getAgentTickets(agentId);
  }

  @Delete(":id/cancel")
  @AllowedRoles(Roles.customer, Roles.admin)
  @UseGuards(TicketOwnershipGuard)
  cancelTicket(@Param("id", ParseIntPipe) ticketId: number) {
    return this.ticketService.cancelTicket(ticketId);
  }

  @Patch(":id")
  @AllowedRoles(Roles.customer, Roles.admin)
  @UseGuards(TicketOwnershipGuard)
  updateTicket(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() updatedTicket: UpdateTicketDto,
  ) {
    return this.ticketService.updateTicketQuestion(ticketId, updatedTicket);
  }

  @Post(":id/answer")
  @AllowedRoles(Roles.admin, Roles.agent)
  @UseGuards(TicketOwnershipGuard)
  answerTicket(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() ticketAnswer: TicketAnswerDto,
  ) {
    return this.ticketService.answerTicket(ticketId, ticketAnswer);
  }
}
