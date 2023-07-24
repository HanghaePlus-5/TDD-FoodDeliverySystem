import { Global, Module } from '@nestjs/common';

import { AlsModule } from 'src/lib/als';
import { CustomConfigModule } from 'src/config';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [
    AlsModule,
    CustomConfigModule,
  ],
  providers: [
    PrismaService,
  ],
  exports: [
    PrismaService,
  ],
})
export class PrismaModule {}
