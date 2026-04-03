import { Injectable } from "@nestjs/common";
import { PromptPrismaRepository } from "./repositories/prompt.prisma.repository";
import { PromptDto } from "./dto/prompt.dto";
import { PromptStatus } from "../../generated/prisma/enums";

@Injectable()
export class PromptService {
  constructor(private readonly promptRepository: PromptPrismaRepository) {}

  async create(userId: string, text: string): Promise<PromptDto> {
    return this.promptRepository.create(userId, text);
  }

  async getPendingPromptWitUsers(batch: number = 50): Promise<any> {
    return this.promptRepository.getPendingPromptWitUsers(batch);
  }

  async update(id: string, status: PromptStatus): Promise<PromptDto> {
    return this.promptRepository.update(id, status);
  }

  async bulkUpdate(ids: string[], status: PromptStatus): Promise<void> {
    return this.promptRepository.bulkUpdate(ids, status);
  }
}
