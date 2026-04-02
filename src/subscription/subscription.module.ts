import { Module } from "@nestjs/common";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionPrismaRepository } from "./repositories/subscription.prisma.repository";

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionPrismaRepository],
})
export class SubscriptionModule {}
