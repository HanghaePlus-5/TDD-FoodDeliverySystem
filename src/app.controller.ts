import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { IgnoreAuth } from './auth/decorators';
import { PrismaService } from './prisma';
import { init } from './prisma/init';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @IgnoreAuth()
  @Get('/db/reset')
  async resetDB() {
    await init(this.prisma);
  }

  @IgnoreAuth()
  @Get('/late')
  async latencyTest(
    @Res({ passthrough: true }) res: Response,
  ) {
    // eslint-disable-next-line no-promise-executor-return
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(600);

    res.status(299).send('latency test');
  }
}
