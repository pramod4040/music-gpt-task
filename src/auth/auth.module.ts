import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { JwtAuthMiddleware } from './middleware/jwt-auth.middleware';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, UserPrismaRepository],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.ALL },
        { path: 'metrics', method: RequestMethod.ALL },
        { path: '/auth/register', method: RequestMethod.ALL },
        { path: '/auth/login', method: RequestMethod.ALL },
        { path: '/auth/refresh', method: RequestMethod.ALL },
      )
      .forRoutes(
        { path: '*', method: RequestMethod.ALL },
      );
  }
}
