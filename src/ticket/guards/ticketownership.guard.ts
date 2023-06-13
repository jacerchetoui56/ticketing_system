import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { TicketService } from "../ticket.service";
import { Roles } from "@prisma/client";

@Injectable()
export class TicketOwnershipGuard implements CanActivate {
  constructor(private readonly ticketService: TicketService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const { id: userId } = request["user"];
    const role: Roles = request["role"];
    const ticketId = parseInt(request.params["id"]);

    let isOwner = false;

    if (role === "agent") {
      isOwner = await this.ticketService.checkTickerAgentOwnership(
        ticketId,
        userId,
      );
    } else if (role === "customer") {
      isOwner = await this.ticketService.checkTicketCustomerOwnership(
        ticketId,
        userId,
      );
    } else if (["admin", "superadmin"].includes(role)) {
      isOwner = true;
    }

    if (!isOwner) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
