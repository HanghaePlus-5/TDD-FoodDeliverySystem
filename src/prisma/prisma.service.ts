import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';
import { performance } from 'node:perf_hooks';

import { EnvService } from 'src/config/env';
import { AsyncStore } from 'src/lib/als';
import Logger from 'src/lib/winston/logger';
import { localLogger } from 'src/utils/logger/localLogger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger: Logger;

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

    this.logger = new Logger(this.env);
  }

  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      const store = this.als.getStore();
      if (store === undefined || store.user === undefined) return next(params);
      // console.log('prisma middleware', store, params);

      const logMessage: DatabaseErrorLog = {
        userId: store.user.userId,
        time: performance.now() - store.start,
        model: params.model,
        action: params.action,
        transaction: params.runInTransaction,
        args: params.args,
        dataPath: params.dataPath,
        date: store.start,
      };
      // console.log('prisma log', logMessage);
      localLogger(JSON.stringify(logMessage));

      if (logMessage.time > 1000) {
        // console.warn('prisma slow query', logMessage);
        this.logger.dbError(logMessage);
      }

      return next(params);
    });

    // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // this.$on('query', async (e) => {
    //   const store = this.als.getStore();
    //   console.log('prisma query', store, e);
    // });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
