import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@prisma/client";
import { Request } from "express";
import { AuthService } from "./auth.service";
import {
  CreateAdminDto,
  CreateAgentDto,
  CreateSuperAdminDto,
  CustomerSignupDto,
  LoginDto,
} from "./dtos/auth.dto";
import { AuthGuard } from "./guards/auth.guard";
import { AllowedRoles } from "./decorators/role.decorator";
import { RoleGuard } from "./guards/role.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login/:userRole")
  @ApiResponse({ status: 403, description: "Forbidden. Invalid Credentials" })
  @ApiBody({
    type: LoginDto,
    examples: {
      admin: {
        value: {
          email: "admin@gmail.com",
          password: "pass",
        } as LoginDto,
      },
      customer: {
        value: {
          email: "jacer@gmail.com",
          password: "pass",
        } as LoginDto,
      },
      agent: {
        value: {
          email: "agent@gmail.com",
          password: "pass",
        } as LoginDto,
      },
      superadmin: {
        value: {
          email: "superadmin@gmail.com",
          password: "pass",
        } as LoginDto,
      },
    },
  })
  @ApiParam({ name: "userRole", enum: Roles })
  login(
    @Body() credentials: LoginDto,
    @Param("userRole", new ParseEnumPipe(Roles))
    userRole: Roles,
  ) {
    return this.authService.login(credentials, userRole);
  }

  @Post("signup")
  @ApiConflictResponse({ description: "email already exists" })
  @ApiResponse({ status: 200, description: "Customer Signed in." })
  @ApiOperation({ summary: "Sign Up for Customer" })
  signupCustomer(@Body() newCustomer: CustomerSignupDto) {
    return this.authService.signupCustomer(newCustomer);
  }

  @Post("agent/new")
  @ApiCreatedResponse({ description: "agent created!" })
  createAgent(@Body() newAgent: CreateAgentDto) {
    return this.authService.createAgent(newAgent);
  }

  @Post("superadmin/new")
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @AllowedRoles(Roles.superadmin)
  @ApiCreatedResponse({ description: "superadmin created!" })
  createSuperAdmin(@Body() newSuperAdmin: CreateSuperAdminDto) {
    return this.authService.createSuperAdmin(newSuperAdmin);
  }

  @Post("admin/new")
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @AllowedRoles(Roles.superadmin)
  @ApiCreatedResponse({ description: "admin created!" })
  createAdmin(@Body() newAdmin: CreateAdminDto) {
    return this.authService.createAdmin(newAdmin);
  }

  @Get("profile")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getCustomerProfile(@Req() request: Request) {
    const { id } = request["user"];
    return this.authService.getProfile(id);
  }
}
