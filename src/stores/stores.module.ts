import { Module } from '@nestjs/common';

import { MenusController } from './menus/menus.controller';
import { MenusService } from './menus/menus.service';
import { StoresController } from './stores/stores.controller';
import { StoresService } from './stores/stores.service';
import { PrismaService } from 'src/prisma';

@Module({
  imports: [],
  controllers: [StoresController, MenusController],
  providers: [StoresService, MenusService, PrismaService],
  exports: [StoresService, MenusService],
})
export class StoresModule {}
