import { Test, TestingModule } from '@nestjs/testing';
import { FavouritesService } from './favourites.service';

describe('FavouritesService', () => {
  let service: FavouritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavouritesService],
    }).compile();

    service = module.get<FavouritesService>(FavouritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
