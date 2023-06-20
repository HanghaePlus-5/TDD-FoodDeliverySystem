import { Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TestModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
