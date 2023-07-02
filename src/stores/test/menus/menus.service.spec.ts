import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';
import { ACTIVATE_MENU_STATUES, ACTIVATE_STORE_STATUES } from 'src/constants/stores';
import { MenusRepository } from 'src/stores/menus/menus.repository';
import { MenusService } from 'src/stores/menus/menus.service';
import { StoresRepository } from 'src/stores/stores/stores.repository';
import { StoresService } from 'src/stores/stores/stores.service';

import {
 createSampleCreateMenuDto, createSampleMenuDto, createSampleStoreDto, createSampleUpdateMenuDto,
} from '../utils/testUtils';

describe('MenusService', () => {
  let menusService: MenusService;
  let menusRepository: MenusRepository;
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
    menusRepository = module.get<MenusRepository>(MenusRepository);
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
        menusService.createMenu(1, sampleCreateMenuDto),
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
        menusService.createMenu(1, sampleCreateMenuDto),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toBeCalledWith(
        'REGISTERED',
        ACTIVATE_STORE_STATUES,
      );
    });

    it('should exec checkDuplicateMenu', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const sampleMenuDto = createSampleMenuDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      await expect(
        menusService.createMenu(1, sampleCreateMenuDto),
      ).rejects.toThrowError('Menu name is not unique on ACTIVATE_MENU_STATUES.');

      expect(mockFindOne).toBeCalledWith({
        storeId: 1,
        name: '아메리카노',
      }, ACTIVATE_MENU_STATUES);
    });

    it('should create menu and return menu dto', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const sampleMenuDto = createSampleMenuDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(null);

      const mockCreate = jest.spyOn(
        menusRepository,
        'create',
      );
      mockCreate.mockResolvedValue(sampleMenuDto);

      const result = await menusService.createMenu(1, sampleCreateMenuDto);
      expect(result).toBe(sampleMenuDto);

      expect(mockCreate).toBeCalledWith(sampleCreateMenuDto);
    });
  });

  describe('updateMenu', () => {
    it('should exec checkStoreOwned', async () => {
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({});
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.updateMenu(1, sampleCreateMenuUpdateDto),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      });
    });

    it('should exec checkStoreStatusGroup', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({});
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
        menusService.updateMenu(1, sampleCreateMenuUpdateDto),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toBeCalledWith(
        'REGISTERED',
        ACTIVATE_STORE_STATUES,
      );
    });

    it('should throw error if menu is not found', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(null);

      await expect(
        menusService.updateMenu(1, sampleCreateMenuUpdateDto),
      ).rejects.toThrowError('Menu not found.');

      expect(mockFindOne).toBeCalledWith({
        storeId: 1,
        menuId: 1,
      }, ACTIVATE_MENU_STATUES);
    });

    it('should check duplicate menu if name is changed', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({
        name: '아메리카노',
      });
      const sampleMenuDto = createSampleMenuDto({});
      const sampleMenuDto2 = createSampleMenuDto({ menuId: 2 });
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

      const mockFindOne = jest.spyOn(menusRepository, 'findOne');
      mockFindOne.mockImplementation(async (dto, statusValues) => {
        if (dto.menuId === sampleCreateMenuUpdateDto.menuId) {
          return Promise.resolve(sampleMenuDto);
        } if (dto.name === sampleCreateMenuUpdateDto.name) {
          return Promise.resolve(sampleMenuDto2);
        }
          return Promise.resolve(null);
      });

      await expect(
        menusService.updateMenu(1, sampleCreateMenuUpdateDto),
      ).rejects.toThrowError('Menu name is not unique on ACTIVATE_MENU_STATUES.');

      expect(mockFindOne).toBeCalledWith({
        storeId: 1,
        name: '아메리카노',
      }, ACTIVATE_MENU_STATUES);
    });

    it('should update menu and return menu dto', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({ name: undefined });
      const sampleMenuDto = createSampleMenuDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      const mockUpdate = jest.spyOn(
        menusRepository,
        'update',
      );
      mockUpdate.mockResolvedValue(sampleMenuDto);

      const result = await menusService.updateMenu(1, sampleCreateMenuUpdateDto);
      expect(result).toBe(sampleMenuDto);

      expect(mockUpdate).toBeCalledWith(sampleCreateMenuUpdateDto);
    });
  });

  describe('changeMenuStatus', () => {
    it('should exec checkStoreOwned', async () => {
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.changeMenuStatus(1, {storeId: 1, menuId: 1, status: 'OPEN'}),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      });
    });

    it('should exec checkStoreStatusGroup', async () => {
      const sampleStoreDto = createSampleStoreDto({status: 'TERMINATED'});
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
        menusService.changeMenuStatus(1, {storeId: 1, menuId: 1, status: 'OPEN'}),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toBeCalledWith(
        'TERMINATED',
        ACTIVATE_STORE_STATUES,
      );
    });

    it('should throw error if menu is not found', async () => {
      const sampleStoreDto = createSampleStoreDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(null);

      await expect(
        menusService.changeMenuStatus(1, {storeId: 1, menuId: 1, status: 'OPEN'}),
      ).rejects.toThrowError('Menu not found.');

      expect(mockFindOne).toBeCalledWith({
        storeId: 1,
        menuId: 1,
      }, ACTIVATE_MENU_STATUES);
    });

    it('should exec checkMenuStatusChangeCondition', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleMenuDto = createSampleMenuDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      const mockCheckMenuStatusChangeCondition = jest.spyOn(
        menusService,
        'checkMenuStatusChangeCondition',
      );
      mockCheckMenuStatusChangeCondition.mockReturnValue(false);

      await expect(
        menusService.changeMenuStatus(1, {storeId: 1, menuId: 1, status: 'OPEN'}),
      ).rejects.toThrowError('Menu status change condition is not met.');

      expect(mockCheckMenuStatusChangeCondition).toBeCalledWith(
        'REGISTERED',
        'OPEN',
      );
    });

    it('should change menu status and return menu dto', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleMenuDto = createSampleMenuDto({});
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

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      const mockCheckMenuStatusChangeCondition = jest.spyOn(
        menusService,
        'checkMenuStatusChangeCondition',
      );
      mockCheckMenuStatusChangeCondition.mockReturnValue(true);

      const mockUpdate = jest.spyOn(
        menusRepository,
        'update',
      );
      mockUpdate.mockResolvedValue(sampleMenuDto);

      const result = await menusService.changeMenuStatus(1, {storeId: 1, menuId: 1, status: 'OPEN'});
      expect(result).toBe(sampleMenuDto);

      expect(mockUpdate).toBeCalledWith({
        menuId: 1,
        storeId: 1,
        status: 'OPEN',
      });
    });
  })

  describe('checkMenuStatusChangeCondition', () => {
    it('should return false if [REGISTERED -> CLOSED]', () => {
      const result = menusService.checkMenuStatusChangeCondition(
        'REGISTERED' as MenuStatus,
        'CLOSED' as MenuStatus,
      );
      expect(result).toBe(false);
    });

    it('should return false if [OPEN -> REGISTERED]', () => {
      const result = menusService.checkMenuStatusChangeCondition(
        'OPEN' as MenuStatus,
        'REGISTERED' as MenuStatus,
      );
      expect(result).toBe(false);
    });

    it('should return true if [REGISTERED -> OPEN]', () => {
      const result = menusService.checkMenuStatusChangeCondition(
        'REGISTERED' as MenuStatus,
        'OPEN' as MenuStatus,
      );
      expect(result).toBe(true);
    });
  });

  describe('getMenus', () => {
    it('should exec checkStoreOwned if viewtype is OWNER', async () => {
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.getMenus(1, 1, 'OWNER' as ViewType),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      });
    });

    it('should get menus', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleMenuDto = createSampleMenuDto({});
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockFindAllByStoreId = jest.spyOn(
        menusRepository,
        'findAllByStoreId',
      );
      mockFindAllByStoreId.mockResolvedValue([sampleMenuDto]);

      const result = await menusService.getMenus(1, 1, 'OWNER' as ViewType);
      expect(result).toEqual([sampleMenuDto]);

      expect(mockFindAllByStoreId).toBeCalledWith(1, 'OWNER' as ViewType);
    });
  });
});
