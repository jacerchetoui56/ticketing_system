import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ChangePasswordDto,
  CreateAgentDto,
  CustomerSignup,
  LoginDto,
} from "./dtos/auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async loginSuperAdmin({ email, password }: LoginDto) {
    const superadmin = await this.prisma.superAdmin.findUnique({
      where: {
        email,
      },
    });

    if (!superadmin) {
      throw new UnauthorizedException();
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      superadmin.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: superadmin.id, name: superadmin.name };
    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async loginAdmin({ email, password }: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }

    const isCorrectPassword = await bcrypt.compare(password, admin.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: admin.id, name: admin.name };
    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async loginAgent({ email, password }: LoginDto) {
    const agent = await this.prisma.agent.findUnique({
      where: {
        email,
      },
    });
    if (!agent) {
      throw new UnauthorizedException();
    }

    const isCorrectPassword = await bcrypt.compare(password, agent.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: agent.id, name: agent.name };
    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async loginCustomer({ email, password }: LoginDto) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    });
    if (!customer) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(password, customer.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: customer.id, name: customer.name };
    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async signupCustomer(credentials: CustomerSignup) {
    const { email, password, name } = credentials;
    const customerExists = await this.prisma.customer.findFirst({
      where: { email },
    });

    if (customerExists) {
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const customer = await this.prisma.customer.create({
      data: {
        ...credentials,
        password: hashedPass,
        role: {
          create: {
            role: "CUSTOMER",
          },
        },
      },
    });

    const payload = {
      id: customer.id,
      name: customer.name,
    };

    const token = await this.jwt.signAsync(payload);

    return { token };
  }

  async getCustomerProfile(id: number) {
    const customer = await this.prisma.customer.findFirst({ where: { id } });
    return PrismaService.exclude(customer, ["password"]);
  }

  async createAgent(newAgent: CreateAgentDto) {
    const hashedPass = await bcrypt.hash(newAgent.password, 10);
    const agent = await this.prisma.agent.create({
      data: { ...newAgent, password: hashedPass },
    });

    return agent;
  }

  async customerChangePassword(userId: number, passwords: ChangePasswordDto) {
    const { oldPassword, newPassword } = passwords;

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: userId,
      },
    });
    if (!customer) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(
      oldPassword,
      customer.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    const changePass = await this.prisma.customer.update({
      where: { id: userId },
      data: { password: hashedPass },
    });

    return "Pass is changed";
  }

  async agentChangePassword(userId: number, passwords: ChangePasswordDto) {
    const { oldPassword, newPassword } = passwords;

    const agent = await this.prisma.agent.findUnique({
      where: {
        id: userId,
      },
    });
    if (!agent) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(oldPassword, agent.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    const changePass = await this.prisma.agent.update({
      where: { id: userId },
      data: { password: hashedPass },
    });

    return "Pass is changed";
  }

  async adminChangePassword(userId: number, passwords: ChangePasswordDto) {
    const { oldPassword, newPassword } = passwords;

    const admin = await this.prisma.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await bcrypt.compare(oldPassword, admin.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const hashedPass = await bcrypt.hash(newPassword, 10);

    const changePass = await this.prisma.admin.update({
      where: { id: userId },
      data: { password: hashedPass },
    });

    return "Pass is changed";
  }
}
