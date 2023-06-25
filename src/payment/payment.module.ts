import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService, PrismaService],
  exports:[PaymentService]
  })
export class PaymentModule {}
