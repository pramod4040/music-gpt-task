import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
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
      req.user = payload;
      next();
    } catch (err) {
      console.error('JWT verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
