import { Module } from "@nestjs/common";
import { PromptController } from "./prompt.controller";
import { PromptService } from "./prompt.service";
import { PromptPrismaRepository } from "./repositories/prompt.prisma.repository";

@Module({
  controllers: [PromptController],
  providers: [PromptService, PromptPrismaRepository],
})
export class PromptModule {}
