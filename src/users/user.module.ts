import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './service/users.service';
import { UserPrismaRepository } from './repositories/user.prisma.repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UserService, UserPrismaRepository, AuthService],
})
export class UserModule {}
