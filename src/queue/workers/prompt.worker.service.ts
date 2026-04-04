import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { QUEUE_FREE, QUEUE_PAID } from '../constants';
import { RedisService } from '../../common/redis/redis.service';
import { PromptService } from '../../prompt/prompt.service';
import { AudioService } from '../../audio/audio.service';
import { GatewayService } from '../../gateway/gateway.service';

@Injectable()
export class PromptWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PromptWorkerService.name);
  private freeWorker: Worker;
  private paidWorker: Worker;

  constructor(
    private readonly redisService: RedisService,
    private readonly promptService: PromptService,
    private readonly audioService: AudioService,
    private readonly gatewayService: GatewayService,
  ) {}

  onModuleInit() {
    const connection = this.redisService.getClient();
    const processor = (job: Job) => this.processPrompt(job);

    this.freeWorker = new Worker(QUEUE_FREE, processor, { connection, concurrency: 2, limiter: { max: 10, duration: 60_000 } });
    this.paidWorker = new Worker(QUEUE_PAID, processor, { connection, concurrency: 15 });

    this.freeWorker.on('failed', (job, err) =>
      this.logger.error(`[free] job ${job?.id} failed: ${err.message}`),
    );
    this.paidWorker.on('failed', (job, err) =>
      this.logger.error(`[paid] job ${job?.id} failed: ${err.message}`),
    );
  }

  private async processPrompt(job: Job): Promise<void> {
    const { promptId, userId } = job.data;
    this.logger.log(`Processing prompt ${promptId} ${userId}`);

    await this.promptService.update(promptId, 'PROCESSING');

    console.log("External service processing it!");
    let aiResult = await new Promise<{ title: string, url: string }>((resolve, reject) => {
      setTimeout(() => {
        resolve({title: `Music Title for ${promptId}`, url: `http://localhost:3001/listen/audio/${userId}`});
      }, 4000)
    })

    await this.promptService.update(promptId, 'COMPLETED');
    await this.audioService.create(userId, promptId, aiResult.title, aiResult.url);
    this.gatewayService.emitToUser(userId, 'prompt-completed', { promptId, title: aiResult.title, url: aiResult.url });
    this.logger.log(`Task is completed ${promptId}`);
  }

  async onModuleDestroy() {
    await Promise.all([this.freeWorker.close(), this.paidWorker.close()]);
  }
}
