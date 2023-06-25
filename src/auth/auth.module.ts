import { Module } from '@nestjs/common';

import { UserTypeGuard } from './guards/user-type.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({})
  ],
  providers: [UserTypeGuard],
  exports: [UserTypeGuard],
  })
export class AuthModule {}
