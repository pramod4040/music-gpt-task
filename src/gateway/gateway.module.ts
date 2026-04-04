import { Module } from '@nestjs/common';
import { PromptGateway } from './prompt.gateway';
import { GatewayService } from './gateway.service';

@Module({
  providers: [PromptGateway, GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
