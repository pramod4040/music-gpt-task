import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from "../lib/prisma.module";
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { RateLimitModule } from './common/guard/ratelimit/rate-limit.module';
import { RedisModule } from './common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    AuthModule,
    SubscriptionModule,
    PrismaModule,
    RedisModule,
    RateLimitModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
