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

import { createSampleCreateMenuDto, createSampleStoreDto } from '../utils/testUtils';

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

    it('should exec checkStoreStatusGroup', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockResolvedValue(false);

      await expect(
        menusService.createMenu(1, 1, sampleCreateMenuDto),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toBeCalledWith(
        'REGISTERED',
        ['REGISTERED', 'OPEN', 'CLOSED'],
      );
    });

    it('should exec checkMenuNameUnique', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockResolvedValue(true);

      const mockCheckMenuNameUnique = jest.spyOn(
        menusService,
        'checkMenuNameUnique',
      );
      mockCheckMenuNameUnique.mockResolvedValue(false);

      await expect(
        menusService.createMenu(1, 1, sampleCreateMenuDto),
      ).rejects.toThrowError('Menu name is not unique.');

      expect(mockCheckMenuNameUnique).toBeCalledWith({
        storeId: 1,
        name: '아메리카노'
      });
    });
  });
});
