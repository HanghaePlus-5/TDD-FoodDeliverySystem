import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
