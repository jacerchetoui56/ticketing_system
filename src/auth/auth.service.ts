import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ChangePasswordDto,
  CreateAgentDto,
  CustomerSignupDto,
  LoginDto,
} from "./dtos/auth.dto";
import { Roles } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto, role: Roles) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        role,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, name: user.name };
    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async signupCustomer(credentials: CustomerSignupDto) {
    const { email, password } = credentials;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const customer = await this.prisma.user.create({
      data: {
        ...credentials,
        password: hashedPass,
        role: "customer",
      },
    });

    const payload = {
      id: customer.id,
      name: customer.name,
    };

    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async createAgent(createAgentDto: CreateAgentDto) {
    const { email, password } = createAgentDto;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    try {
      await this.prisma.user.create({
        data: {
          ...createAgentDto,
          password: hashedPass,
          role: "agent",
        },
      });

      return { message: "Agent created!" };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async changePassword(userId: number, passwords: ChangePasswordDto) {
    const { oldPassword, newPassword } = passwords;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPass },
    });

    return "Pass is changed";
  }

  async getProfile(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return PrismaService.exclude(user, ["password"]);
  }

  async userRole(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    return user;
  }
}
