import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvService } from 'src/config/env';
import { CustomConfigModule } from 'src/config';

import { BearerAuthGuard } from './guards';
import { JwtStrategy } from './passport';
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: BearerAuthGuard,
    },
    JwtAuthService,
    JwtStrategy,
  ],
  exports: [
    JwtAuthService,
  ],
})
export class AuthModule {}
