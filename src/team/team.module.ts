import { Module } from "@nestjs/common";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
