import { ApiResponseOptions } from "@nestjs/swagger";
import { DEFAULT_RESPONSE } from "src/shared/constants/swagger-docs";
import { HttpStatus } from "@nestjs/common";
import { Field, Team } from "../dtos/team.dto";
import { UserDTO } from "src/auth/dtos/auth.dto";

export const ALL_TEAMS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [Team],
    status: HttpStatus.OK,
    description: "All Teams",
  },
];

export const ALL_FIELDS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [Field],
    status: HttpStatus.OK,
    description: "All Fields",
  },
];

export const TEAMS_OF_FIELD_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [Team],
    status: HttpStatus.OK,
    description: "All Teams of a Field",
  },
];

export const TEAM_MEMBERS_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: [UserDTO],
    status: HttpStatus.OK,
    description: "All Members Of a Team",
  },
];

export const CREATE_TEAM_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: Team,
    status: HttpStatus.CREATED,
    description: "Team Created Successfully",
  },
];

export const ADD_AGENT_TO_TEAM_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    status: HttpStatus.CREATED,
    description: "Agent added Successfully",
  },
];

export const CREATE_FIELD_RESPONSE: ApiResponseOptions[] = [
  ...DEFAULT_RESPONSE,
  {
    type: Field,
    status: HttpStatus.CREATED,
    description: "Field Created Successfully",
  },
];
