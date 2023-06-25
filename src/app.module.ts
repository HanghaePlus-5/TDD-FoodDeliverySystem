import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypiaModule } from './typia/typia.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    UsersModule,
    TypiaModule,
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
