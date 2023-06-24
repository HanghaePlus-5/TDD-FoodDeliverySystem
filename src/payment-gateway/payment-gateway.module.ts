import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';

@Module({
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService]
})
export class PaymentGatewayModule {}
