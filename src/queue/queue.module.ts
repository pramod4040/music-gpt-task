import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { QueueService } from './queue.service';
import { PromptWorkerService } from './workers/prompt.worker.service';
import { PromptModule } from '../prompt/prompt.module';
import { AudioPrismaRepository } from '../audio/repositories/audio.prisma.repository';
import { AudioService } from '../audio/audio.service';

@Module({
  imports: [PromptModule],
  providers: [CronService, QueueService, PromptWorkerService, AudioService, AudioPrismaRepository],
  exports: [QueueService],
})
export class QueueModule {}
