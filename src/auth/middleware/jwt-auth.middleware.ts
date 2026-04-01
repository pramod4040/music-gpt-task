import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';
import { UserPrismaRepository } from '../repositories/user.prisma.repository';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    private userRepository: UserPrismaRepository
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Missing or invalid Bearer token');
    }

    try {
      const secretKey = this.configService.get<string>('JWT_SECRET_KEY') || 'your-secret-key';
      if (secretKey == 'your-secret-key') {
        console.warn('Using default JWT secret key. Please set JWT_SECRET_KEY in your environment variables for better security.');
      }
      const payload = jwt.verify(token, secretKey) as JwtUserPayload;

      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.force_login) {
        throw new UnauthorizedException('Session expired, please login again!');
      }

      req.user = payload;
      next();
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      console.error('JWT verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
