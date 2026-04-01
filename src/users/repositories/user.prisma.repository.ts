import { IUserRepository } from "./user.repository.interface";
import { User, CreateUserInterface, GetUserForLogin, UserWithRefreshToken } from "../../models/user.model";
import { PrismaService } from "lib/prisma.service";
import { SubscriptionStatus } from "generated/prisma/enums";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private prisma: PrismaService ) { }

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
      where: { email: email }
    });
    return user ? this.toModel(user) : null;
  }

  async findByEmailForLogin(email: string): Promise<GetUserForLogin | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    });
    return user;
  }

  async findById(id: string): Promise<UserWithRefreshToken | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      subscription_status: user.subscription_status as SubscriptionStatus,
      refresh_token: user.refresh_token
    };
  }

  async updateRefreshToken(id: string, hashedRefreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refresh_token: hashedRefreshToken }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  // Strips Prisma-specific types, returns plain object
  private toModel(prismaUser: any): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      display_name: prismaUser.display_name,
      subscription_status: prismaUser.subscription_status as SubscriptionStatus
    };
  }

}