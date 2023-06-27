import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

import { PaymentService } from './payment.service';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

@Module({
  providers: [PaymentService, PrismaService, PaymentGatewayService],
  exports:[PaymentService]
  })
export class PaymentModule {}
