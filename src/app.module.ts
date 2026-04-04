import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from "../lib/prisma.module";
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { UsersModule } from './users/users.module';
import { AudioModule } from './audio/audio.module';
import { PromptModule } from './prompt/prompt.module';
import { QueueModule } from './queue/queue.module';
import { GatewayModule } from './gateway/gateway.module';
import { RateLimitModule } from './common/guard/ratelimit/rate-limit.module';
import { RedisModule } from './common/redis/redis.module';
import { CacheModule } from './common/cache/cache.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    SubscriptionModule,
    UsersModule,
    AudioModule,
    PromptModule,
    QueueModule,
    GatewayModule,
    PrismaModule,
    RedisModule,
    RateLimitModule,
    CacheModule

  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
