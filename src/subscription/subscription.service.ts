import { Injectable } from "@nestjs/common";
import { SubscriptionStatus } from "generated/prisma/enums";
import { SubscriptionPrismaRepository } from "./repositories/subscription.prisma.repository";
import { CacheInvalidate, CacheService } from "../common/cache";

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionRepository: SubscriptionPrismaRepository,
    private cacheService: CacheService
  ) {}

  @CacheInvalidate({
    patterns: ["users:paginated:*"],
    buildKeys: (id: string) => [`users:id:["${id}"]`]
  })
  async subscribe(userId: string): Promise<void> {
    await this.subscriptionRepository.updateSubscription(userId, SubscriptionStatus.PAID, false);
  }

  @CacheInvalidate({
    patterns: ["users:paginated:*"],
    buildKeys: (id: string) => [`users:id:["${id}"]`]
  })
  async cancel(userId: string): Promise<void> {
    await this.subscriptionRepository.updateSubscription(userId, SubscriptionStatus.FREE, true);
  }
}
