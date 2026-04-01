import { User } from "../../models/user.model";

export interface IUserRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
