import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TaskService } from "./task/task.service";
import { TeamModule } from "./team/team.module";
import { TicketModule } from "./ticket/ticket.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    TicketModule,
    TeamModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    AppService,
    TaskService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
