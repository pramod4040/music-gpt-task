import { Controller, Get, UseGuards, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitGuard } from './common/guard/ratelimit/rate-limit.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("testing")
  postTest(): string {
    return this.appService.getHello();
  }
}
