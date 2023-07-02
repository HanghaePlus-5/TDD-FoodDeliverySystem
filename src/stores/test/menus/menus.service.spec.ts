import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';
import { MenusRepository } from 'src/stores/menus/menus.repository';
import { MenusService } from 'src/stores/menus/menus.service';
import { StoresRepository } from 'src/stores/stores/stores.repository';
import { StoresService } from 'src/stores/stores/stores.service';

import { createSampleCreateMenuDto } from '../utils/testUtils';

describe('MenusService', () => {
  let menusService: MenusService;
  let storesService: StoresService;
  let envService: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        MenusService,
        StoresService,
        MenusRepository,
        StoresRepository,
        EnvService,
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    menusService = module.get<MenusService>(MenusService);
    storesService = module.get<StoresService>(StoresService);
    envService = module.get<EnvService>(EnvService);
  });

  it('should be defined', () => {
    expect(menusService).toBeDefined();
  });

  describe('createMenu', () => {
    it('should exec checkStoreOwned', async () => {
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.createMenu(1, 1, sampleCreateMenuDto),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      });
    });
  });
});
