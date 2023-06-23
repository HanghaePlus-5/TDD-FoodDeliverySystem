import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';
import { StoresModule } from './stores/stores.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule,
    StoresModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
