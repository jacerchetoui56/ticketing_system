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
import { userRoles } from "src/auth";
import { AllowedRoles } from "src/auth/decorators/role.decorator";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RoleGuard } from "src/auth/guards/role.guard";
import { CreateTicketDto, UpdateTicketDto } from "./dtos/ticket.dto";
import { Request } from "express";
import { TicketService } from "./ticket.service";

@Controller("ticket")
@UseGuards(AuthGuard, RoleGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @AllowedRoles(userRoles.admin, userRoles.customer)
  getTickets() {
    return this.ticketService.getWaitingTickets();
  }

  @Post("new")
  @AllowedRoles(userRoles.customer, userRoles.admin)
  createTicket(@Body() ticket: CreateTicketDto, @Req() request: Request) {
    const user = request["user"];
    console.log(
      "🚀 ~ file: ticket.controller.ts:20 ~ TicketController ~ createTicket ~ ticket:",
      ticket,
    );
    return `creating the ticket by ${user.id}`;
  }

  @Delete(":id/cancel")
  @AllowedRoles(userRoles.customer, userRoles.admin)
  cancelTicket(@Param("id", ParseIntPipe) ticketId: number) {
    return `canceling the ticket ${ticketId}`;
  }

  @Patch(":id")
  @AllowedRoles(userRoles.customer, userRoles.admin)
  updateTicket(
    @Param("id", ParseIntPipe) ticketId: number,
    @Body() updatedTicket: UpdateTicketDto,
  ) {
    console.log(
      "🚀 ~ file: ticket.controller.ts:52 ~ TicketController ~ updatedTicket:",
      updatedTicket,
    );

    return `canceling the ticket ${ticketId}`;
  }

  @Post(":id/answer")
  @AllowedRoles(userRoles.admin, userRoles.agent)
  asnwerTicket(@Param("id", ParseIntPipe) ticketId: number) {
    return `answering the ticket ${ticketId}`;
  }
}
