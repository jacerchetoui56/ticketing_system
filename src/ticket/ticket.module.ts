import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { AuthModule } from "src/auth/auth.module";
import { MyLoggerModule } from "src/my-logger/my-logger.module";
import { TicketResponseInterceptor } from "./interceptors/TicketResponse.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [AuthModule, MyLoggerModule],
  providers: [
    TicketService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TicketResponseInterceptor,
    },
  ],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
