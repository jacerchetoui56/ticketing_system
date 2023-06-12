import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async getWaitingTickets() {
    const tickets = await this.prisma.ticket.findMany({
      where: {
        state: "WAITING",
      },
    });

    return tickets;
  }
}
