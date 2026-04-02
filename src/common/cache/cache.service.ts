import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  private get client() {
    return this.redisService.getClient();
  }

  // Core: get-or-set pattern — the one you'll use 90% of the time
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl = 60,
  ): Promise<T> {
    const cached = await this.client.get(key);
    if (cached !== null) return JSON.parse(cached) as T;

    const value = await factory();
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    return value;
  }

  async get<T>(key: string): Promise<T | null> {
    const val = await this.client.get(key);
    return val ? (JSON.parse(val) as T) : null;
  }

  async set(key: string, value: unknown, ttl = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Safe pattern-based invalidation using SCAN (production-safe, unlike KEYS)
  async delByPattern(pattern: string): Promise<void> {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;
      if (keys.length) await this.client.del(...keys);
    } while (cursor !== '0');
  }
}