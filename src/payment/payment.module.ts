import { Module } from '@nestjs/common';

import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

import { PaymentService } from './payment.service';

@Module({
  providers: [PaymentService, PaymentGatewayService],
  exports:[PaymentService]
  })
export class PaymentModule {}
