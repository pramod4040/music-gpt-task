import { IUserRepository } from "./user.repository.interface";
import { User, CreateUserInterface, GetUserForLogin, UserWithRefreshToken } from "../../models/user.model";
import { PrismaService } from "lib/prisma.service";
import { SubscriptionStatus } from "generated/prisma/enums";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(userData: CreateUserInterface): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        display_name: userData.display_name,
        subscription_status: userData.subscription_status,
        password: userData.password
      }
    });

    return this.toModel(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });
    return user ? this.toModel(user) : null;
  }

  async findByEmailForLogin(email: string): Promise<GetUserForLogin | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByIdInternal(id: string): Promise<UserWithRefreshToken | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      subscription_status: user.subscription_status as SubscriptionStatus,
      refresh_token: user.refresh_token,
      force_login: user.force_login
    };
  }
    
    async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return user ? this.toModel(user) : null;
  }

  async updateRefreshToken(id: string, hashedRefreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refresh_token: hashedRefreshToken, force_login: false }
    });
  }

  async logout(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refresh_token: null, force_login: true }
    });
  }

  async findAll(options: { skip?: number, take?: number } = {}): Promise<User[]> {
    const users = await this.prisma.user.findMany(options);
    return users.map((u) => this.toModel(u));
  }

  async updateDisplayName(id: string, display_name: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { display_name },
    });
    return this.toModel(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toModel(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      display_name: prismaUser.display_name,
      subscription_status: prismaUser.subscription_status as SubscriptionStatus
    };
  }
}
