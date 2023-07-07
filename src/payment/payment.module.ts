import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService, PrismaService, PaymentGatewayService],
  exports:[PaymentService]
  })
export class PaymentModule {}
