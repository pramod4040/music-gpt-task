import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { RedisService } from "../../redis/redis.service";

@Injectable()
export class RateLimitService {
  constructor(private readonly redisService: RedisService) {}

    async slidingWindowRateLimit(userId: string, limit: number) {

        const client = this.redisService.getClient();
        const key = `rate_limit:${userId}`;
        const now = Date.now();
        const windowSize = 60 * 1000; // 60 sec

        // 1. Remove old requests (outside window) // sorted sets
        await client.zremrangebyscore(key, 0, now - windowSize);

        // 2. Count current requests
        const count = await client.zcard(key);

        if (count >= limit) {
            throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
        }

        // 3. Add current request
        await client.zadd(key, now, `${now}-${Math.random()}`);

        // 4. Optional: set expiry to clean up
        await client.expire(key, 60);

        return true;
    }

}