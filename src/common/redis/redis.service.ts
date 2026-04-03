import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null
    });
  }

  getClient(): Redis {
    return this.client;
  }

  // createBullMQConnection(): Redis {
  //   return new Redis({
  //     host: process.env.REDIS_HOST,
  //     port: parseInt(process.env.REDIS_PORT || '6379'),
  //   });
  // }
}