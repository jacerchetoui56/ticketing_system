import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TicketModule } from './ticket/ticket.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [AuthModule, PrismaModule, TicketModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
