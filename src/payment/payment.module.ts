import { Module } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { PrismaService } from 'src/prisma';

@Module({
  providers: [PaymentService, PrismaService],
  exports:[PaymentService]
  })
export class PaymentModule {}
