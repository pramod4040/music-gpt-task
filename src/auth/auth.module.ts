import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthMiddleware } from './middleware/jwt-auth.middleware';

@Module({
  imports: [ConfigModule],
  providers: [],
  exports: [],
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
