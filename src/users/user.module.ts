import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UserService } from './service/users.service';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UsersController],
  providers: [UserService, UserPrismaRepository, AuthService],
})
export class UserModule {}
