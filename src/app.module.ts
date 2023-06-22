import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}