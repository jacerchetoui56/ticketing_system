import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFieldDto, CreateTeamDto } from "./dtos/team.dto";

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTeams() {
    const teams = await this.prisma.team.findMany();

    return teams;
  }

  async getFieldsList() {
    const fields = await this.prisma.field.findMany();

    return fields;
  }

  async getTeamsOfField(fieldId: number) {
    const teams = await this.prisma.team.findMany({
      where: {
        fieldId,
      },
    });

    return teams;
  }

  async getTeamMembers(teamId: number) {
    const agents = await this.prisma.user.findMany({
      where: {
        role: "agent",
        teamId,
      },
      select: { id: true, name: true, email: true },
    });

    return agents;
  }

  async createTeam(newTeam: CreateTeamDto) {
    const team = await this.prisma.team.create({
      data: newTeam,
    });

    return team;
  }

  async addAgentToTeam(agentId: number, teamId: number) {
    const agentExists = await this.prisma.user.findFirst({
      where: {
        id: agentId,
        role: "agent",
      },
    });

    if (!agentExists) {
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
    const field = await this.prisma.field.create({
      data: newField,
    });

    return field;
  }
}