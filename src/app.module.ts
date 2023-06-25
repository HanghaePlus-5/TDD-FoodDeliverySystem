import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';
import { StoresModule } from './stores/stores.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavouritesModule } from './favourites/favourites.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule,
    StoresModule
    ReviewsModule,
    FavouritesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}