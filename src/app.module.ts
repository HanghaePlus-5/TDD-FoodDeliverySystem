import { Module } from '@nestjs/common';

import { CustomConfigModule } from './config/config.module';
import { ExampleModule } from './examples/example.module';
import { FavouritesModule } from './favourites/favourites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentGatewayModule } from './lib/payment-gateway/payment-gateway.module';

@Module({
  imports: [
    CustomConfigModule,
    UsersModule,
    OrdersModule,
    ExampleModule,
    StoresModule,
    ReviewsModule,
    FavouritesModule,
    PaymentModule,
    DeliveryModule,
    PaymentGatewayModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
