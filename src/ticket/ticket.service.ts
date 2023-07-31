import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  TicketAnswerDto,
  CreateTicketDto,
  UpdateTicketDto,
  RateDto,
} from "./dtos/ticket.dto";
import { Rating } from "@prisma/client";
import { MyLogger } from "../my-logger/my-logger.service";

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async getAllTickets() {
    this.logger.log("getting all tickets");
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
        rating: true,
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
    this.logger.log("getting WAITING tickets");
    const tickets = await this.prisma.ticket.findMany({
      where: {
        state: "WAITING",
      },
    });

    return tickets;
  }

  async getPendingTickets() {
    this.logger.log("getting PENDING tickets");
    const tickets = await this.prisma.ticket.findMany({
      where: {
        state: "PENDING",
      },
    });

    return tickets;
  }

  async getCustomerTickets(customerId: number) {
    this.logger.log(`getting tickets of Customer #${customerId}`);
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
    this.logger.log(`Creating a ticket for Customer #${customerId}`);
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
    this.logger.log(`Assigning ticket #${ticketId} to Agent #${agentId}`);
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
    this.logger.log(`getting the ticket of the agent #${agentId}`);
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
    this.logger.log(
      `Ticket ${ticketId} is answered with ${ticketAnswer.answer}`,
    );
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
    this.logger.log(
      `Question of ticker #${ticketId} is updated to ${updates.question}`,
    );
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

  async checkTicketAgentOwnership(ticketId: number, agentId: number) {
    this.logger.log(
      `Checking ticket #${ticketId} ownership to agent #${agentId}`,
    );
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        agentId: agentId,
      },
    });

    return ticket ? true : false;
  }

  async checkTicketCustomerOwnership(ticketId: number, customerId: number) {
    this.logger.log(
      `Checking ticket #${ticketId} ownership to customer #${customerId}`,
    );
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        customerId,
      },
    });

    return ticket ? true : false;
  }

  async cancelTicket(ticketId: number) {
    this.logger.log(`Canceling Ticket #${ticketId}`);
    const checkTicket = await this.prisma.ticket.findFirst({
      where: { id: ticketId },
    });
    if (["PENDING", "COMPLETED", "RESOLVED"].includes(checkTicket.state)) {
      throw new BadRequestException("You can not cancel ticket now");
    }
    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { state: "CANCELED" },
    });
    return ticket;
  }

  async reopenTicket(ticketId: number) {
    this.logger.log(`Reopen the ticket #${ticketId}`);
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

  async rateTicket(ticketId: number, { rating }: RateDto) {
    this.logger.log(`Rating ticket #${ticketId} with "${rating}"`);
    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        rating,
        state: "COMPLETED",
      },
    });

    return ticket;
  }

  async getRatings() {
    this.logger.log("Getting ratings");
    return { ...Rating };
  }

  async checkTicketClosing() {
    this.logger.log("Closing Forgotten Tickets 🕒");
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDay() - 3);

    await this.prisma.ticket.updateMany({
      where: {
        rating: null,
        state: "COMPLETED",
        updated_at: {
          lt: threeDaysAgo,
        },
      },
      data: {
        state: "CLOSED",
      },
    });
  }
}
