import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  ParseEnumPipe,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { CreateAgentDto, CustomerSignupDto, LoginDto } from "./dtos/auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { Roles } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login/:userRole")
  login(
    @Body() credentials: LoginDto,
    @Param("userRole", new ParseEnumPipe(Roles)) userRole: Roles,
  ) {
    return this.authService.login(credentials, userRole);
  }

  @Post("signup")
  signupCustomer(@Body() newCustomer: CustomerSignupDto) {
    return this.authService.signupCustomer(newCustomer);
  }

  @Post("agent/new")
  createAgent(@Body() newAgent: CreateAgentDto) {
    return this.authService.createAgent(newAgent);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  getCustomerProfile(@Req() request: Request) {
    const { id } = request["user"];
    return this.authService.getProfile(id);
  }
}
