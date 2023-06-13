import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  TicketAnswerDto,
  CreateTicketDto,
  UpdateTicketDto,
} from "./dtos/ticket.dto";

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTickets() {
    const tickets = await this.prisma.ticket.findMany({
      select: {
        id: true,
        customer: {
          select: { id: true, name: true },
        },
        question: true,
        agent: {
          select: { id: true, name: true },
        },
        state: true,
        answer: {
          select: {
            answer: true,
          },
        },
      },
    });

    return tickets;
  }

  async getWaitingTickets() {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        state: "WAITING",
      },
    });

    return tickets;
  }

  async getPendingTickets() {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        state: "PENDING",
      },
    });

    return tickets;
  }

  async getCustomerTickets(customerId: number) {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        customerId,
        state: {
          in: ["WAITING", "PENDING"],
        },
      },
    });

    return tickets;
  }

  async createTicket(newTicket: CreateTicketDto, customerId: number) {
    const ticket = await this.prisma.ticket.create({
      data: {
        ...newTicket,
        customerId,
        state: "WAITING",
      },
    });
    return ticket;
  }

  async assignToAgent(ticketId: number, agentId: number) {
    const alreadyAssigned = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { agentId: true, agent: { select: { name: true } }, state: true },
    });

    if (!alreadyAssigned) {
      throw new BadRequestException();
    }

    if (alreadyAssigned.agentId) {
      throw new BadRequestException(
        `Ticket already assigned to ${alreadyAssigned.agent.name}`,
      );
    }

    if (alreadyAssigned.state === "CANCELED") {
      throw new BadRequestException(`Ticket is Canceled`);
    }

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        agentId,
        state: "PENDING",
      },
    });

    return { message: "Ticket is assigned" };
  }

  async getAgentTickets(agentId: number) {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        agentId,
        state: {
          in: ["WAITING", "PENDING"],
        },
      },
    });

    return tickets;
  }

  async answerTicket(ticketId: number, ticketAnswer: TicketAnswerDto) {
    await this.prisma.answer.create({
      data: {
        ticketId,
        answer: ticketAnswer.answer,
      },
    });
    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        state: "RESOLVED",
      },
    });

    return { message: "Answer is added" };
  }

  async updateTicketQuestion(ticketId: number, updates: UpdateTicketDto) {
    const checkTicket = await this.prisma.ticket.findFirst({
      where: { id: ticketId },
    });
    if (checkTicket.state !== "WAITING") {
      throw new BadRequestException("Ticket can not be updated");
    }

    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        question: updates.question,
      },
    });

    return ticket;
  }

  async checkTickerAgentOwnership(ticketId: number, agentId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        agentId: agentId,
      },
    });

    return ticket ? true : false;
  }

  async checkTicketCustomerOwnership(ticketId: number, customerId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        customerId,
      },
    });

    return ticket ? true : false;
  }

  async cancelTicket(id: number) {
    const checkTicket = await this.prisma.ticket.findFirst({
      where: { id },
    });
    if (["PENDING", "COMPLETED", "RESOLVED"].includes(checkTicket.state)) {
      throw new BadRequestException("You can not cancel ticket now");
    }
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { state: "CANCELED" },
    });
    return ticket;
  }

  async reopenTicket(ticketId: number) {
    const checkTicket = await this.prisma.ticket.findFirst({
      where: { id: ticketId },
    });
    if (checkTicket.state !== "RESOLVED") {
      throw new BadRequestException("ticket is not resolved yet");
    }

    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { state: "WAITING" },
    });

    return ticket;
  }
}
