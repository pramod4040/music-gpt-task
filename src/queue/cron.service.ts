import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PromptService } from '../prompt/prompt.service';
import { Queue } from 'bullmq';

@Injectable()
export class CronService {
  constructor(
    private promptService: PromptService,
    private queue: Queue, // inject properly (shown later)
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS) // adjust as needed
  async handlePendingJobs() {
    console.log('Cron running...');

    const pendingItems = await this.promptService.getPendingPromptWitUsers(50);

    if (pendingItems.length === 0) return;

    let queuedPromptsIds: string[] = [];
    for (const item of pendingItems) {
      await this.queue.add('process-task', {
        taskId: item.id,
      });
      queuedPromptsIds.push(item.id)
    }

    await this.promptService.bulkUpdate(queuedPromptsIds, 'PROCESSING');
  }
}
