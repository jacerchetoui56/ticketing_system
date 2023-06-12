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
  CustomerSignup,
  LoginDto,
} from "./dtos/auth.dto";
import { userRoles } from ".";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto, userRole: userRoles) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        Role: {
          name: userRoles[userRole],
        },
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

  async signupCustomer(credentials: CustomerSignup) {
    const { email, password, name } = credentials;

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
        roleId: 3,
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
    const { email, password, name } = createAgentDto;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    try {
      const agent = await this.prisma.user.create({
        data: {
          ...createAgentDto,
          password: hashedPass,
          roleId: 2,
        },
      });

      const payload = {
        id: agent.id,
        name: agent.name,
      };

      const token = await this.jwt.signAsync(payload);

      return { token };
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

    const changePass = await this.prisma.user.update({
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
        Role: {
          select: {
            name: true,
          },
        },
      },
    });
    return user;
  }
}
