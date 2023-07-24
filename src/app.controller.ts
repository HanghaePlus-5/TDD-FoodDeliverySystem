import { Controller, Get } from '@nestjs/common';

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
}
