import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import env from './env';

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
