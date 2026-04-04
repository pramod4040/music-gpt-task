import { AudioDto } from "../dto/audio.dto";

export interface IAudioRepository {
  findAllByUser(userId: string): Promise<AudioDto[]>;
  findByIdAndUser(id: string, userId: string): Promise<AudioDto | null>;
  updateTitle(id: string, userId: string, title: string): Promise<AudioDto>;
  create(userId: string, promptId: string, title: string, url: string): Promise<AudioDto>;
}
