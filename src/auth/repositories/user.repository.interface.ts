import { User } from "../../models/user.model";

export interface IUserRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  updateDisplayName(id: string, display_name: string): Promise<User>;
  delete(id: string): Promise<void>;
}
