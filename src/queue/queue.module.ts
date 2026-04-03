import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { QueueService } from './queue.service';
import { PromptWorkerService } from './workers/prompt.worker.service';
import { PromptModule } from '../prompt/prompt.module';

@Module({
  imports: [PromptModule],
  providers: [CronService, QueueService, PromptWorkerService],
  exports: [QueueService],
})
export class QueueModule {}
