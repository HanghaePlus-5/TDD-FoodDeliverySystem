import { Test, TestingModule } from '@nestjs/testing';

import { MenusController } from 'src/stores/menus/menus.controller';
import { MenusService } from 'src/stores/menus/menus.service';

describe('MenusController', () => {
  let controller: MenusController;
  let menusService: MenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [
        {
          provide: MenusService,
          useValue: {
            createMenu: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MenusController>(MenusController);
    menusService = module.get<MenusService>(MenusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
