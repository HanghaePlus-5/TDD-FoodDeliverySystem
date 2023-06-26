import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserTypeGuard } from './guards/user-type.guard';
import { JwtAuthService } from './services';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({})
  ],
  providers: [UserTypeGuard, JwtAuthService],
  exports: [UserTypeGuard],
  })
export class AuthModule {}
