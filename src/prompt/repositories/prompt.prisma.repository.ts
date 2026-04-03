import { Injectable } from "@nestjs/common";
import { PrismaService } from "lib/prisma.service";
import { IPromptRepository } from "./prompt.repository.interface";
import { PromptDto } from "../dto/prompt.dto";

@Injectable()
export class PromptPrismaRepository implements IPromptRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, text: string): Promise<PromptDto> {
    return this.prisma.prompt.create({
      data: { user_id: userId, text, status: "PENDING" },
    });
  }

  async getPendingPromptWitUsers(batch: number = 50): Promise<any> {
    return this.prisma.prompt.findMany({
      where: { status: "PENDING" },
      take: batch,
      include: {
        user: {
          select: {
            id: true,
            subscription_status: true,
          },
        },
      },
    });
  }

  async update(id: string, status: string): Promise<PromptDto> {
    return this.prisma.prompt.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async bulkUpdate(ids: string[], status: string): Promise<void> {
    await this.prisma.prompt.updateMany({
      where: { id: { in: ids } },
      data: { status: status as any },
    });
  }
}
