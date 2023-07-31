import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { TicketService } from "src/ticket/ticket.service";

@Injectable()
export class TaskService {
  constructor(private readonly ticketService: TicketService) {}

  @Cron(CronExpression.EVERY_30_MINUTES, {
    name: "canceling_forgotten_tickets",
  })
  checkTicketClosing() {
    this.ticketService.checkTicketClosing();
  }

  //   @Cron(CronExpression.EVERY_10_SECONDS)
  //   testing() {
  //     console.log("testing cron");
  //   }
}
