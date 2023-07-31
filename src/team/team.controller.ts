import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  AddAgentToTeamDto,
  CreateFieldDto,
  CreateTeamDto,
} from "./dtos/team.dto";
import { AllowedRoles } from "src/auth/decorators/role.decorator";
import { Roles } from "@prisma/client";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { RoleGuard } from "src/auth/guards/role.guard";
import { TeamService } from "./team.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller()
@ApiBearerAuth()
@ApiTags("Teams")
@UseGuards(AuthGuard, RoleGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get("team/all")
  getAllTeams() {
    return this.teamService.getAllTeams();
  }

  @Get("fields")
  @AllowedRoles(Roles.admin, Roles.superadmin)
  getFields() {
    return this.teamService.getFieldsList();
  }

  @Get("team/field/:id")
  @AllowedRoles(Roles.admin, Roles.agent)
  getTeamsOfField(@Param("id", ParseIntPipe) fieldId: number) {
    return this.teamService.getTeamsOfField(fieldId);
  }

  @Get("team/:id/members")
  @AllowedRoles(Roles.admin, Roles.superadmin, Roles.agent)
  getTeamMembers(@Param("id", ParseIntPipe) teamId: number) {
    return this.teamService.getTeamMembers(teamId);
  }

  @Post("team/new")
  @AllowedRoles(Roles.admin, Roles.superadmin)
  createTeam(@Body() newTeam: CreateTeamDto) {
    return this.teamService.createTeam(newTeam);
  }

  @Post("team/:id/add")
  @AllowedRoles(Roles.admin, Roles.superadmin)
  addAgentToTeam(
    @Body() newAgent: AddAgentToTeamDto,
    @Param("id", ParseIntPipe) teamId: number,
  ) {
    return this.teamService.addAgentToTeam(newAgent.agentId, teamId);
  }

  @Post("field/new")
  @AllowedRoles(Roles.admin, Roles.superadmin)
  createField(@Body() newField: CreateFieldDto) {
    return this.teamService.createField(newField);
  }
}
