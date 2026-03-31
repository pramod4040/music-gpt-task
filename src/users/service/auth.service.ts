import { Injectable } from "@nestjs/common";
import { UserPrismaRepository } from "../repositories/user.prisma.repository"
import * as bcrypt from 'bcrypt';
import { User, JwtUserPayload } from "../../models/user.model";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserPrismaRepository,
        private jwtService: JwtService, 
        private configService: ConfigService
    ) {}

    async isValidUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return null;
        }
        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return null;
        }
        return user;
    }

    async generateJwtToken(user: JwtUserPayload): Promise<string> {
        const accessToken = this.jwtService.sign(user, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '10m',
        });
        
        return accessToken;
    }
}