import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';

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
