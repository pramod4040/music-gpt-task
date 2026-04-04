import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PromptService } from '../prompt/prompt.service';
import { QueueService } from './queue.service';
import { AudioService } from '../audio/audio.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly promptService: PromptService,
    private readonly queueService: QueueService
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handlePendingJobs() {
    const pendingItems = await this.promptService.getPendingPromptWitUsers(25);
    if (pendingItems.length === 0) return;

    const ids = pendingItems.map((item: any) => item.id);
    await this.promptService.bulkUpdate(ids, 'QUEUED');

    for (const item of pendingItems) {
      await this.queueService.add(item.id, item.user.subscription_status, item.user.id);
    }

    this.logger.log(`Queued ${pendingItems.length} prompts`);
  }
}
