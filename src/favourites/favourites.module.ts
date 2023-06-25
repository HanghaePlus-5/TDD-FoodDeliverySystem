import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService]
})
export class FavouritesModule {}
