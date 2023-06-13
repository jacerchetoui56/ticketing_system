import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export interface IUserFromToken {
  id: number;
  username: number;
  exp: number;
  iat: number;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.getTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      request["user"] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  getTokenFromRequest(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") || [];
    return type === "Bearer" ? token : null;
  }
}
