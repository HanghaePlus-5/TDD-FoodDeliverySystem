import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { AuthModule } from 'src/auth/auth.module';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
