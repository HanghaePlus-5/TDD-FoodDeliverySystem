import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvService } from 'src/config/env';
import { CustomConfigModule } from 'src/config';

import { UserTypeGuard } from './guards/user-type.guard';
import { JwtAuthService } from './services';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (env: EnvService) => ({
        secret: env.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: env.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [EnvService],
    })
  ],
  providers: [UserTypeGuard, JwtAuthService],
  exports: [UserTypeGuard],
  })
export class AuthModule {}
