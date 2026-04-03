import { Injectable } from "@nestjs/common";
import { PrismaService } from "lib/prisma.service";
import { IAudioRepository } from "./audio.repository.interface";
import { AudioDto } from "../dto/audio.dto";

@Injectable()
export class AudioPrismaRepository implements IAudioRepository {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string): Promise<AudioDto[]> {
    return this.prisma.audio.findMany({ where: { user_id: userId } });
  }

  async findByIdAndUser(id: string, userId: string): Promise<AudioDto | null> {
    return this.prisma.audio.findFirst({ where: { id, user_id: userId } });
  }

  async updateTitle(id: string, userId: string, title: string): Promise<AudioDto> {
    return this.prisma.audio.update({
      where: { id, user_id: userId },
      data: { title },
    });
  }

  async create(userId: string, promptId: string, title: string, url: string): Promise<AudioDto> {
    return this.prisma.audio.create({
      data: { user_id: userId, prompt_id: promptId, title: title, url: url }
    });
  }
}
