import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { env } from './env';
import { EnvService } from './env/env.service';

@Global()
@Module({
  imports: [
  ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
    load: [env]
    }),
  ],
  providers: [
  EnvService,
  ConfigService,
  ],
  exports: [
  EnvService
  ],
  })
export class CustomConfigModule {}
