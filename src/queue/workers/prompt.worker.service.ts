import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { QUEUE_FREE, QUEUE_PAID } from '../constants';
import { RedisService } from '../../common/redis/redis.service';
import { PromptService } from '../../prompt/prompt.service';

@Injectable()
export class PromptWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PromptWorkerService.name);
  private freeWorker: Worker;
  private paidWorker: Worker;

  constructor(
    private readonly redisService: RedisService,
    private readonly promptService: PromptService,
  ) {}

  onModuleInit() {
    const connection = this.redisService.getClient();
    const processor = (job: Job) => this.processPrompt(job);

    this.freeWorker = new Worker(QUEUE_FREE, processor, { connection, concurrency: 5 });
    this.paidWorker = new Worker(QUEUE_PAID, processor, { connection, concurrency: 15 });

    this.freeWorker.on('failed', (job, err) =>
      this.logger.error(`[free] job ${job?.id} failed: ${err.message}`),
    );
    this.paidWorker.on('failed', (job, err) =>
      this.logger.error(`[paid] job ${job?.id} failed: ${err.message}`),
    );
  }

  private async processPrompt(job: Job): Promise<any> {
    const { promptId } = job.data;
    this.logger.log(`Processing prompt ${promptId}`);

    await this.promptService.update(promptId, 'PROCESSING');

    console.log("External service processing it!");
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        //
      }, 3000)
    })

    await this.promptService.update(promptId, 'COMPLETED');
    this.logger.log(`Task is completed ${promptId}`);
    return { status: "success"}
  }

  async onModuleDestroy() {
    await Promise.all([this.freeWorker.close(), this.paidWorker.close()]);
  }
}
