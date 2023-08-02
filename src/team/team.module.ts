import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [AuthModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
