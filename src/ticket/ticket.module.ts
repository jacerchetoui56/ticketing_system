import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { AuthModule } from "src/auth/auth.module";
import { MyLoggerModule } from "src/my-logger/my-logger.module";

@Module({
  imports: [AuthModule, MyLoggerModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
