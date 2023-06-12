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
import { CustomerSignup, LoginDto } from "./dtos/auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { userRoles } from ".";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login/:userRole")
  login(
    @Body() credentials: LoginDto,
    @Param("userRole", new ParseEnumPipe(userRoles)) userRole: userRoles,
  ) {
    return this.authService.login(credentials, userRole);
  }

  @Post("signup")
  signupCustomer(@Body() newCustomer: CustomerSignup) {
    return this.authService.signupCustomer(newCustomer);
  }

  @Get("profile")
  @UseGuards(AuthGuard)
  getCustomerProfile(@Req() request: Request) {
    const { id } = request["user"];
    return this.authService.getProfile(id);
  }
}
