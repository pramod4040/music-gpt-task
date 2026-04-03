import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_FREE, QUEUE_PAID } from './constants';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private freeQueue: Queue;
  private paidQueue: Queue;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    const connection = this.redisService.getClient();
    this.freeQueue = new Queue(QUEUE_FREE, { connection });
    this.paidQueue = new Queue(QUEUE_PAID, { connection });
  }

  async add(promptId: string, subscriptionStatus: string): Promise<void> {
    if (subscriptionStatus === 'PAID') {
      await this.paidQueue.add('process-prompt', { promptId });
    } else {
      await this.freeQueue.add('process-prompt', { promptId });
    }
  }

  async onModuleDestroy() {
    await Promise.all([this.freeQueue.close(), this.paidQueue.close()]);
  }
}
