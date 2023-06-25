import { Module } from '@nestjs/common';
import { StoresController } from './stores/stores.controller';
import { StoresService } from './stores/stores.service';
import { MenusController } from './menus/menus.controller';
import { MenusService } from './menus/menus.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [StoresController, MenusController],
  providers: [StoresService, MenusService],
  exports: [StoresService, MenusService],
})
export class StoresModule {}
