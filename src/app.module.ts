import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule,
    ReviewsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}