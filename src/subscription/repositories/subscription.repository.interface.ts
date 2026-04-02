import { SubscriptionStatus } from "generated/prisma/enums";

export interface ISubscriptionRepository {
  updateSubscription(userId: string, status: SubscriptionStatus, isCanceled: boolean): Promise<void>;
}
