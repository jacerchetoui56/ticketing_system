import { SetMetadata } from "@nestjs/common";
import { Roles } from "@prisma/client";

export const AllowedRoles = (...roles: Roles[]) => SetMetadata("roles", roles);
