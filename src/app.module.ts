import { Module } from '@nestjs/common';

import { CustomConfigModule } from './config/config.module';
import { ExampleModule } from './examples/example.module';
import { FavouritesModule } from './favourites/favourites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoresModule } from './stores/stores.module';
import { UsersModule } from './users/users.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    CustomConfigModule,
    UsersModule,
    ExampleModule,
    StoresModule,
    ReviewsModule,
    FavouritesModule,
    PaymentModule,
    DeliveryModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
