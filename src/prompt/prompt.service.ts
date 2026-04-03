import { Injectable } from "@nestjs/common";
import { PromptPrismaRepository } from "./repositories/prompt.prisma.repository";
import { PromptDto } from "./dto/prompt.dto";

@Injectable()
export class PromptService {
  constructor(private readonly promptRepository: PromptPrismaRepository) {}

  async create(userId: string, text: string): Promise<PromptDto> {
    return this.promptRepository.create(userId, text);
  }

  async getPendingPromptWitUsers(batch: number = 50): Promise<any> {
    return this.promptRepository.getPendingPromptWitUsers(batch);
  }

  async update(id: string, status: string): Promise<PromptDto> {
    return this.promptRepository.update(id, status);
  }

  async bulkUpdate(ids: string[], status: string): Promise<void> {
    return this.promptRepository.bulkUpdate(ids, status);
  }
}
