import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

import { EnvService } from 'src/config/env';
import { AsyncStore } from 'src/lib/als';

import { init } from './init';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    private readonly als: AsyncLocalStorage<AsyncStore>,
    private readonly env: EnvService,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    console.log('should reset?', this.env.get<boolean>('DATABASE_RESET'));
    if (this.env.get<boolean>('DATABASE_RESET')) await init(this);

    this.$use(async (params, next) => {
      const store = this.als.getStore();
      console.log('prisma middleware', store, params);
      return next(params);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', async (e) => {
      const store = this.als.getStore();
      console.log('prisma query', store, e);
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
