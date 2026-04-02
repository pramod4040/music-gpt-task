import { Module } from "@nestjs/common";
import { AudioController } from "./audio.controller";
import { AudioService } from "./audio.service";
import { AudioPrismaRepository } from "./repositories/audio.prisma.repository";

@Module({
  controllers: [AudioController],
  providers: [AudioService, AudioPrismaRepository],
})
export class AudioModule {}
