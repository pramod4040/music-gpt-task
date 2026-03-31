import { IUserRepository } from "./user.repository.interface";
import { User, CreateUserInterface } from "../../models/user.model";
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