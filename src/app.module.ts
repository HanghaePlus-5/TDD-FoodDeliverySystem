import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavouritesModule } from './favourites/favourites.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule,
    ReviewsModule,
    FavouritesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}