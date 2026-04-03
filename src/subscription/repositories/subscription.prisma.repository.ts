import { Injectable } from "@nestjs/common";
import { SubscriptionStatus } from "generated/prisma/enums";
import { PrismaService } from "lib/prisma.service";
import { ISubscriptionRepository } from "./subscription.repository.interface";
import { CacheInvalidate } from "../../common/cache";

@Injectable()
export class SubscriptionPrismaRepository implements ISubscriptionRepository {
  constructor(private prisma: PrismaService) {}

  async updateSubscription(userId: string, status: SubscriptionStatus, isCanceled: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { subscription_status: status, isCanceled }
    });
  }
}
