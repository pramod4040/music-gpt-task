import { PromptDto } from "../dto/prompt.dto";

export interface IPromptRepository {
  create(userId: string, text: string): Promise<PromptDto>;
  getPendingPromptWitUsers(batch: number): Promise<any>;
  update(id: string, status: string): Promise<PromptDto>;
  bulkUpdate(ids: string[], status: string): Promise<void>;
}
