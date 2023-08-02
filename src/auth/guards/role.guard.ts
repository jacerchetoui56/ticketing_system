import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth.service";
import { IUserFromToken } from "./auth.guard";
import { Request } from "express";
import { MyLogger } from "src/my-logger/my-logger.service";
import { Roles } from "@prisma/client";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly logger: MyLogger,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const allowedRoles = this.reflector.getAllAndOverride("roles", [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const user: IUserFromToken = request["user"];
    const userRole = await this.authService.userRole(user.id);

    if (
      !allowedRoles.includes(userRole.role) &&
      userRole.role !== Roles.superadmin
    ) {
      this.logger.error(
        `${userRole.role} is not allowed to access ${request.url}`,
      );
      return false;
    }
    request["role"] = userRole.role;
    return true;
  }
}
