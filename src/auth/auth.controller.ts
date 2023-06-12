import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import {
  ChangePasswordDto,
  CreateAgentDto,
  CustomerSignup,
  LoginDto,
} from "./dtos/auth.dto";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login/superAdmin")
  loginSuperAdmin(@Body() credentials: LoginDto) {
    return this.authService.loginSuperAdmin(credentials);
  }

  @Post("login/admin")
  loginAdmin(@Body() credentials: LoginDto) {
    return this.authService.loginAdmin(credentials);
  }

  @Post("login/agent")
  loginAgent(@Body() credentials: LoginDto) {
    return this.authService.loginAgent(credentials);
  }

  @Post("login/customer")
  loginCustomer(@Body() credentials: LoginDto) {
    return this.authService.loginCustomer(credentials);
  }

  @Post("signup/customer")
  signUpCustomer(credentials: CustomerSignup) {
    return this.authService.signupCustomer(credentials);
  }

  @Post("agent/new")
  addAgent(newAgent: CreateAgentDto) {
    return this.authService.createAgent(newAgent);
  }
  @Post("profile/agent/password")
  adminChangePassword(passwords: ChangePasswordDto, @Req() request: Request) {
    const user = request["user"];
    return this.authService.agentChangePassword(user.id, passwords);
  }

  @Post("profile/agent/password")
  agentChangePassword(passwords: ChangePasswordDto, @Req() request: Request) {
    const user = request["user"];
    return this.authService.agentChangePassword(user.id, passwords);
  }

  @Post("profile/customer/password")
  customerChangePassword(
    passwords: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const user = request["user"];
    return this.authService.customerChangePassword(user.id, passwords);
  }

  @Get("profile/customer")
  getCustomerProfile(@Req() request: Request) {
    const { id } = request["user"];
    return this.authService.getCustomerProfile(id);
  }
}
