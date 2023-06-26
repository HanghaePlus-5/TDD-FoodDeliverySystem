import { ConsoleLogger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { env } from './env';

@Injectable()
export class EnvService {
  private readonly logger = new ConsoleLogger(EnvService.name);
  constructor(
    private readonly config: ConfigService,
  ) {
    this.checkUndefinedVariables();
  }

  get<T>(key: keyof ReturnType<typeof env>) {
    const value = this.config.get<T>(key);
    if (value === undefined) {
      throw new InternalServerErrorException(`Missing environment variable: ${key}`);
    }
    return value;
  }

  checkUndefinedVariables() {
    const missingKeys = Object.entries(env()).map(([key, value]) => {
      if (value === undefined) {
        this.logger.error(`Env variable ${key} is undefined`);
        return key;
      }
    }).filter(Boolean);

    if (missingKeys.length > 0) {
      throw new Error('Missing env variables detected!!');
    } else {
      this.logger.log('All env variables clear');
    }
  }
}
