import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { RateLimitService } from "./rate-limit.service";
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private rateLimitService: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user ?? null;
    // We are not using any rate limit in public route, we can do if needed using ip address
    if (!user) {
        return true;
    }

    const limit = user.subscription_status === 'FREE' ? 20 : 100;

    await this.rateLimitService.slidingWindowRateLimit(user.id, limit);

    return true;
  }
}