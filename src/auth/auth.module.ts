import { Module } from '@nestjs/common';

import { UserTypeGuard } from './guards/user-type.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({})
  ],
  providers: [UserTypeGuard, AuthService],
  exports: [UserTypeGuard],
  })
export class AuthModule {}
