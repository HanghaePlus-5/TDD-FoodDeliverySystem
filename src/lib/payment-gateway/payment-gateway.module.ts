import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

@Module({
  providers: [PaymentGatewayService]
})
export class PaymentGatewayModule {}
