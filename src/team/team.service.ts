import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFieldDto, CreateTeamDto } from "./dtos/team.dto";
import { MyLogger } from "src/my-logger/my-logger.service";
import { UserDTO } from "src/auth/dtos/auth.dto";

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: MyLogger,
  ) {}

  async getAllTeams() {
    this.logger.log(`Getting all teams`);
    const teams = await this.prisma.team.findMany({
      include: {
        field: true,
      },
    });

    return teams;
  }

  async getFieldsList() {
    this.logger.log(`Getting all fields`);
    const fields = await this.prisma.field.findMany();

    return fields;
  }

  async getTeamsOfField(fieldId: number) {
    this.logger.log(`Getting teams of field #${fieldId}`);
    const teams = await this.prisma.team.findMany({
      where: {
        fieldId,
      },
    });

    return teams;
  }

  async getTeamMembers(teamId: number) {
    this.logger.log(`Getting the members of the team #${teamId}`);
    const agents = await this.prisma.user.findMany({
      where: {
        role: "agent",
        teamId,
      },
    });

    return agents.map((agent) => new UserDTO(agent));
  }

  async createTeam(newTeam: CreateTeamDto) {
    this.logger.log("Admin is creating a new team");
    const team = await this.prisma.team.create({
      data: newTeam,
    });

    return team;
  }

  async addAgentToTeam(agentId: number, teamId: number) {
    this.logger.log(`Admin is adding the agent #${agentId} to team #${teamId}`);
    const agentExists = await this.prisma.user.findFirst({
      where: {
        id: agentId,
        role: "agent",
      },
    });

    if (!agentExists) {
      this.logger.error(
        `Adding the agent #${agentId} to team #${teamId} is denied`,
      );
      throw new BadRequestException("agent does not exist");
    }

    await this.prisma.user.update({
      where: { id: agentId },
      data: {
        teamId,
      },
    });

    return { message: "agent added!" };
  }

  async createField(newField: CreateFieldDto) {
    this.logger.log(`Admin is creating a new Field`);
    const field = await this.prisma.field.create({
      data: newField,
    });

    return field;
  }
}
