import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import {
  ChangePasswordDto,
  CreateAdminDto,
  CreateAgentDto,
  CreateSuperAdminDto,
  CustomerSignupDto,
  LoginDto,
} from "./dtos/auth.dto";
import { Roles } from "@prisma/client";
import { MyLogger } from "src/my-logger/my-logger.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly logger: MyLogger,
  ) {}

  async login({ email, password }: LoginDto, role: Roles) {
    this.logger.log(`${email} is logging`);
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        role,
      },
    });

    if (!user) {
      this.logger.error(`${email} logging is denied`);
      throw new ForbiddenException();
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      this.logger.error(`${email} passpord is wrong`);
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, name: user.name };
    const token = await this.jwt.signAsync(payload);

    this.logger.log(`${email} is logged in successfully`);

    return { token };
  }

  async signupCustomer(credentials: CustomerSignupDto) {
    this.logger.log(`${credentials.email} is signing up`);

    const { email, password } = credentials;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      this.logger.error(
        `${credentials.email} signing is denied : customer already exists`,
      );
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

    this.logger.log(`${credentials.email} is signed in successfully`);

    return { token };
  }

  async createAgent(createAgentDto: CreateAgentDto) {
    this.logger.log(`Admin is creating agent : ${createAgentDto.email}`);
    const { email, password } = createAgentDto;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      this.logger.error(
        `Creating agent ${createAgentDto.email} is denied : agent already exists`,
      );
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

      this.logger.log(`Creating agent ${createAgentDto.email} is successful`);

      return { message: "Agent created!" };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    this.logger.log(`Super Admin is creating admin : ${createAdminDto.email}`);
    const { email, password } = createAdminDto;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      this.logger.error(
        `Creating admin ${createAdminDto.email} is denied : admin already exists`,
      );
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    try {
      await this.prisma.user.create({
        data: {
          ...createAdminDto,
          password: hashedPass,
          role: "admin",
        },
      });

      this.logger.log(`Creating admin ${createAdminDto.email} is successful`);

      return { message: "Admin created!" };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) {
    this.logger.log(
      `Super Admin is creating super admin : ${createSuperAdminDto.email}`,
    );
    const { email, password } = createSuperAdminDto;

    const customerExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (customerExists) {
      this.logger.error(
        `Creating super admin ${createSuperAdminDto.email} is denied : super admin already exists`,
      );
      throw new ConflictException();
    }

    const hashedPass = await bcrypt.hash(password, 10);

    try {
      await this.prisma.user.create({
        data: {
          ...createSuperAdminDto,
          password: hashedPass,
          role: "superadmin",
        },
      });

      this.logger.log(
        `Creating super admin ${createSuperAdminDto.email} is successful`,
      );

      return { message: "Super Admin created!" };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async changePassword(userId: number, passwords: ChangePasswordDto) {
    this.logger.log(`user #${userId} is changing password`);

    const { oldPassword, newPassword } = passwords;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      this.logger.error(`user #${userId} changing password is denied`);
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
    this.logger.log(`user #${id} is getting his profile`);
    const user = await this.prisma.user.findUnique({ where: { id } });

    return PrismaService.exclude(user, ["password"]);
  }

  async userRole(userId: number) {
    this.logger.log(`Getting the role of the user #${userId}`);
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
