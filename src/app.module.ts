import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CustomConfigModule } from './config/config.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ExampleModule } from './examples/example.module';
import { FavouritesModule } from './favourites/favourites.module';
import { AlsModule, AlsMiddleware } from './lib/als';
import { PaymentGatewayModule } from './lib/payment-gateway/payment-gateway.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    AlsModule,
    CustomConfigModule,
    UsersModule,
    OrdersModule,
    ExampleModule,
    StoresModule,
    ReviewsModule,
    FavouritesModule,
    PaymentModule,
    DeliveryModule,
    PaymentGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
