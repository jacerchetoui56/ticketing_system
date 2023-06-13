import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../auth.service";
import { IUserFromToken } from "./auth.guard";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const allowedRoles = this.reflector.getAllAndOverride("roles", [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const user: IUserFromToken = request["user"];
    const userRole = await this.authService.userRole(user.id);

    if (!allowedRoles.includes(userRole.role)) {
      console.log("Not Authorized ⚠️");
      return false;
    }
    console.log("Authorized ✅");
    request["role"] = userRole.role;
    return true;
  }
}
