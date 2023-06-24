import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule,
    PaymentGatewayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
