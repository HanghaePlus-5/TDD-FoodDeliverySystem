import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './common/filters';
import { CustomConfigModule } from './config/config.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ExampleModule } from './examples/example.module';
import { FavouritesModule } from './favourites/favourites.module';
import { AlsMiddleware } from './lib/als';
import { PaymentGatewayModule } from './lib/payment-gateway/payment-gateway.module';
import Logger from './lib/winston/logger';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CustomConfigModule,
    PrismaModule,
    AuthModule,

    DeliveryModule,
    ExampleModule,
    FavouritesModule,
    OrdersModule,
    ReviewsModule,
    StoresModule,
    PaymentModule,
    PaymentGatewayModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
