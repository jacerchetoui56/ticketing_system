import { SetMetadata } from "@nestjs/common";
import { userRoles } from "..";

export const AllowedRoles = (...roles: userRoles[]) =>
  SetMetadata("roles", roles);
