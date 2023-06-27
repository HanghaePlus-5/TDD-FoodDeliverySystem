import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
