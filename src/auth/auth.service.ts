import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserPrismaRepository } from "./repositories/user.prisma.repository";
import * as bcrypt from 'bcrypt';
import { User, JwtUserPayload } from "../models/user.model";
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
        const user = await this.userRepository.findByEmailForLogin(email);
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
        return this.jwtService.sign(user, {
            secret: this.configService.get('JWT_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_EXPIRES_IN') || '10m',
        });
    }

    async generateRefreshToken(user: JwtUserPayload): Promise<string> {
        return this.jwtService.sign(user, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
        });
    }

    async saveHashedRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashed = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.updateRefreshToken(userId, hashed);
    }

    async logout(userId: string): Promise<void> {
        await this.userRepository.logout(userId);
    }

    async validateAndRotateRefreshToken(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        // Verify JWT signature and expiry
        const userPayload = this.jwtService.verify(refreshToken, {
            secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        });

        const user = await this.userRepository.findById(userPayload.id);
        if (!user || !user.refresh_token) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Compare against stored hash
        const tokenMatches = await bcrypt.compare(refreshToken, user.refresh_token);
        if (!tokenMatches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload: JwtUserPayload = {
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            subscription_status: user.subscription_status,
        };

        const newAccessToken = await this.generateJwtToken(payload);
        const newRefreshToken = await this.generateRefreshToken(payload);
        await this.saveHashedRefreshToken(user.id, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
