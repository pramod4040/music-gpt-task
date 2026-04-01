import { Injectable } from "@nestjs/common";
import { UserPrismaRepository } from "./repositories/user.prisma.repository";
import * as bcrypt from 'bcrypt';
import { User, CreateUserInterface } from "../models/user.model";

@Injectable()
export class UserService {
    constructor(private userRepository: UserPrismaRepository) {}

    async createUser(user: CreateUserInterface): Promise<User> {
        user.password = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS || '10'));
        return this.userRepository.create(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }
}
