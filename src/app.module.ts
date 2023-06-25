import { Module } from '@nestjs/common';

import { FavouritesModule } from './favourites/favourites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { StoresModule } from './stores/stores.module';
import { TypiaModule } from './typia/typia.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
  UsersModule,
  TypiaModule,
  StoresModule,
  ReviewsModule,
  FavouritesModule
  ],
  controllers: [],
  providers: [],
  })
export class AppModule {}
