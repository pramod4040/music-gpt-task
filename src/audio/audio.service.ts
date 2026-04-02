import { Injectable, NotFoundException } from "@nestjs/common";
import { AudioPrismaRepository } from "./repositories/audio.prisma.repository";
import { AudioDto } from "./dto/audio.dto";

@Injectable()
export class AudioService {
  constructor(private readonly audioRepository: AudioPrismaRepository) {}

  async findAllByUser(userId: string): Promise<AudioDto[]> {
    return this.audioRepository.findAllByUser(userId);
  }

  async findByIdAndUser(id: string, userId: string): Promise<AudioDto> {
    const audio = await this.audioRepository.findByIdAndUser(id, userId);
    if (!audio) throw new NotFoundException("Audio not found");
    return audio;
  }

  async updateTitle(id: string, userId: string, title: string): Promise<AudioDto> {
    await this.findByIdAndUser(id, userId);
    return this.audioRepository.updateTitle(id, userId, title);
  }
}
