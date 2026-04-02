import { Injectable, NotFoundException } from "@nestjs/common";
import { UserPrismaRepository } from "../auth/repositories/user.prisma.repository";
import { User, CreateUserInterface } from "../models/user.model";
import * as bcrypt from 'bcrypt';
import { Cacheable, CacheService, CacheInvalidate } from "src/common/cache";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserPrismaRepository,
    private readonly cacheService: CacheService
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  @Cacheable("users:paginated", 60)
  async findAllPaginated(skip: number, limit: number = 10): Promise<User[]> {
    return this.userRepository.findAll({ skip: skip, take: limit});
  }

  @Cacheable("users:id", 60)
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user as User;
  }

  @CacheInvalidate({
    patterns: ["users:paginated:*"],
    buildKeys: (id: string) => [`users:id:["${id}"]`]
  })
  async updateDisplayName(id: string, display_name: string): Promise<User> {
    await this.findById(id);
    return this.userRepository.updateDisplayName(id, display_name);
  }

  async createUser(user: CreateUserInterface): Promise<User> {
    user.password = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS || '10'));
    return this.userRepository.create(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}

