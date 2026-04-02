import { Injectable } from "@nestjs/common";
import { SubscriptionStatus } from "generated/prisma/enums";
import { SubscriptionPrismaRepository } from "./repositories/subscription.prisma.repository";

@Injectable()
export class SubscriptionService {
  constructor(private subscriptionRepository: SubscriptionPrismaRepository) {}

  async subscribe(userId: string): Promise<void> {
    await this.subscriptionRepository.updateSubscription(userId, SubscriptionStatus.PAID, false);
  }

  async cancel(userId: string): Promise<void> {
    await this.subscriptionRepository.updateSubscription(userId, SubscriptionStatus.FREE, true);
  }
}
