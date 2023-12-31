import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { ACTIVATE_MENU_STATUES, ACTIVATE_STORE_STATUES } from 'src/constants/stores';
import { MenusRepository } from 'src/stores/menus/menus.repository';
import { MenusService } from 'src/stores/menus/menus.service';
import { StoresRepository } from 'src/stores/stores/stores.repository';

import * as validationModule from '../../utils/validation';
import {
createSampleCreateMenuDto, createSampleMenuDto, createSampleStoreDto, createSampleUpdateMenuDto, createSampleUserPayloadBusiness,
} from '../testUtils';

describe('MenusService', () => {
  let menusService: MenusService;
  let menusRepository: MenusRepository;
  let storesRepository: StoresRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        MenusService,
        StoresRepository,
        MenusRepository,
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    menusService = module.get<MenusService>(MenusService);
    menusRepository = module.get<MenusRepository>(MenusRepository);
    storesRepository = module.get<StoresRepository>(StoresRepository);
  });

  it('should be defined', () => {
    expect(menusService).toBeDefined();
  });

  describe('createMenu', () => {
    it('should exec checkStoreOwned', async () => {
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.createMenu(sampleUserPayloadBusiness, sampleCreateMenuDto),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      }, 'OWNER');
    });

    it('should exec checkStoreStatusGroup', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuDto = createSampleCreateMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      ).mockReturnValue(false);

      await expect(
        menusService.createMenu(sampleUserPayloadBusiness, sampleCreateMenuDto),
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
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      await expect(
        menusService.createMenu(sampleUserPayloadBusiness, sampleCreateMenuDto),
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
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

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

      const result = await menusService.createMenu(sampleUserPayloadBusiness, sampleCreateMenuDto);
      expect(result).toBe(sampleMenuDto);

      expect(mockCreate).toBeCalledWith(sampleCreateMenuDto);
    });
  });

  describe('updateMenu', () => {
    it('should exec checkStoreOwned', async () => {
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.updateMenu(sampleUserPayloadBusiness, sampleCreateMenuUpdateDto),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      }, 'OWNER');
    });

    it('should exec checkStoreStatusGroup', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(false);

      await expect(
        menusService.updateMenu(sampleUserPayloadBusiness, sampleCreateMenuUpdateDto),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toBeCalledWith(
        'REGISTERED',
        ACTIVATE_STORE_STATUES,
      );
    });

    it('should throw error if menu is not found', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleCreateMenuUpdateDto = createSampleUpdateMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(null);

      await expect(
        menusService.updateMenu(sampleUserPayloadBusiness, sampleCreateMenuUpdateDto),
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
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

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
        menusService.updateMenu(sampleUserPayloadBusiness, sampleCreateMenuUpdateDto),
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
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

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

      const result = await menusService.updateMenu(sampleUserPayloadBusiness, sampleCreateMenuUpdateDto);
      expect(result).toBe(sampleMenuDto);

      expect(mockUpdate).toBeCalledWith(sampleCreateMenuUpdateDto);
    });
  });

  describe('changeMenuStatus', () => {
    it('should exec checkStoreOwned', async () => {
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.changeMenuStatus(sampleUserPayloadBusiness, { storeId: 1, menuId: 1, status: 'OPEN' }),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      }, 'OWNER');
    });

    it('should exec checkStoreStatusGroup', async () => {
      const sampleStoreDto = createSampleStoreDto({ status: 'TERMINATED' });
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(false);

      await expect(
        menusService.changeMenuStatus(sampleUserPayloadBusiness, { storeId: 1, menuId: 1, status: 'OPEN' }),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toBeCalledWith(
        'TERMINATED',
        ACTIVATE_STORE_STATUES,
      );
    });

    it('should throw error if menu is not found', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);
      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(null);

      await expect(
        menusService.changeMenuStatus(sampleUserPayloadBusiness, { storeId: 1, menuId: 1, status: 'OPEN' }),
      ).rejects.toThrowError('Menu not found.');

      expect(mockFindOne).toBeCalledWith({
        storeId: 1,
        menuId: 1,
      }, ACTIVATE_MENU_STATUES);
    });

    it('should exec checkMenuStatusChangeCondition', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleMenuDto = createSampleMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      const mockCheckMenuStatusChangeCondition = jest.spyOn(
        validationModule,
        'checkMenuStatusChangeCondition',
      );
      mockCheckMenuStatusChangeCondition.mockReturnValue(false);

      await expect(
        menusService.changeMenuStatus(sampleUserPayloadBusiness, { storeId: 1, menuId: 1, status: 'OPEN' }),
      ).rejects.toThrowError('Menu status change condition is not met.');

      expect(mockCheckMenuStatusChangeCondition).toBeCalledWith(
        'REGISTERED',
        'OPEN',
      );
    });

    it('should change menu status and return menu dto', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleMenuDto = createSampleMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        validationModule,
        'checkStoreStatusGroup',
      );
      mockCheckStoreStatusGroup.mockReturnValue(true);

      const mockFindOne = jest.spyOn(
        menusRepository,
        'findOne',
      );
      mockFindOne.mockResolvedValue(sampleMenuDto);

      const mockCheckMenuStatusChangeCondition = jest.spyOn(
        validationModule,
        'checkMenuStatusChangeCondition',
      );
      mockCheckMenuStatusChangeCondition.mockReturnValue(true);

      const mockUpdate = jest.spyOn(
        menusRepository,
        'update',
      );
      mockUpdate.mockResolvedValue(sampleMenuDto);

      const result = await menusService.changeMenuStatus(sampleUserPayloadBusiness, { storeId: 1, menuId: 1, status: 'OPEN' });
      expect(result).toBe(sampleMenuDto);

      expect(mockUpdate).toBeCalledWith({
        menuId: 1,
        storeId: 1,
        status: 'OPEN',
      });
    });
  });

  describe('getMenus', () => {
    it('should exec checkStoreOwned if viewtype is OWNER', async () => {
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        menusService.getMenus(1, 'OWNER' as ViewType, sampleUserPayloadBusiness),
      ).rejects.toThrowError('User does not own store');

      expect(mockCheckStoreOwned).toBeCalledWith({
        storeId: 1,
        userId: 1,
      }, 'OWNER' as ViewType);
    });

    it('should get menus', async () => {
      const sampleStoreDto = createSampleStoreDto({});
      const sampleMenuDto = createSampleMenuDto({});
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();

      const mockCheckStoreOwned = jest.spyOn(
        storesRepository,
        'findOne',
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockFindAllByStoreId = jest.spyOn(
        menusRepository,
        'findAllByStoreId',
      );
      mockFindAllByStoreId.mockResolvedValue([sampleMenuDto]);

      const result = await menusService.getMenus(1, 'OWNER' as ViewType, sampleUserPayloadBusiness);
      expect(result).toEqual([sampleMenuDto]);

      expect(mockFindAllByStoreId).toBeCalledWith(1, 'OWNER' as ViewType);
    });
  });
});
