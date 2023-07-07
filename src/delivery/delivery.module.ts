import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService, PrismaService],
  exports: [PrismaService]
})
export class DeliveryModule { }
