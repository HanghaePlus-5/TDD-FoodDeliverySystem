import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';

import { StoresService } from 'src/stores/stores/stores.service';
import { StoresRepository } from 'src/stores/stores/stores.repository';
import { StoreCreateDto, StoreDto } from 'src/stores/dto';
import { StoreUpdateDto } from 'src/stores/dto/store-update.dto';
import { createSampleCreateStoreDto, createSampleStoreDto, createSampleUpdateStoreDto } from '../utils/testUtils';

describe('StoresService', () => {
  let storesService: StoresService;
  let storesReposiroty: StoresRepository;
  let envService: EnvService;

  const MIN_COOKING_TIME = 5;
  const MAX_COOKING_TIME = 120;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StoresService, StoresRepository, EnvService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    storesService = module.get<StoresService>(StoresService);
    storesReposiroty = module.get<StoresRepository>(StoresRepository);
    envService = module.get<EnvService>(EnvService);
  });

  it('should be defined', () => {
    expect(storesService).toBeDefined();
  });

  describe('createStore', () => {
    it('should throw error if validation fails', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const mockCheckValidation = jest.spyOn(
        storesService,
        'checkValidation' as any,
      );
      mockCheckValidation.mockResolvedValue(false);

      await expect(
        storesService.createStore(1, sampleCreateStoreDto),
      ).rejects.toThrowError('Validation failed.');

      expect(mockCheckValidation).toHaveBeenCalled();
    });

    it('should throw error if store business number check fails', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const mockCheckBusinessNumber = jest.spyOn(
        storesService,
        'checkBusinessNumber' as any,
      );
      mockCheckBusinessNumber.mockResolvedValue(false);

      await expect(
        storesService.createStore(1, sampleCreateStoreDto),
      ).rejects.toThrowError('Invalid business number.');

      expect(mockCheckBusinessNumber).toHaveBeenCalled();
    });

    it('should create store and return storeDto', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({});
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const mockcreate = jest.spyOn(storesReposiroty, 'create');
      mockcreate.mockResolvedValue(sampleStoreDto);

      const result = await storesService.createStore(1, sampleCreateStoreDto);
      expect(result).toBe(sampleStoreDto);

      expect(mockcreate).toHaveBeenCalledWith({
        ...sampleCreateStoreDto,
        userId: 1,
      });
    });
  });

  describe('checkValidation', () => {
    it('should include store name length > 0', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, name: '' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include store name english', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, name: 'english' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include store name special character', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, name: '커피커피!' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should include businessNumber length 12', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, businessNumber: '123-12-1234' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include phoneNumber length < 11', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, phoneNumber: '02-123-123' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include phoneNumber length > 13', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, phoneNumber: '031-1234-12345' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should include postalNumber length 5', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, postalNumber: '1234' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include openingTime over 23', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, openingTime: 24 };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include closingTime under 0', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = { ...sampleCreateStoreDto, closingTime: -1 };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include cookingTime under min time', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = {
        ...sampleCreateStoreDto,
        cookingTime: MIN_COOKING_TIME - 1,
      };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include cookingTime over max time', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      const dto = {
        ...sampleCreateStoreDto,
        cookingTime: MAX_COOKING_TIME + 1,
      };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should pass validation', async () => {
      const sampleCreateStoreDto: StoreCreateDto = createSampleCreateStoreDto({})
      expect(
        await storesService.checkValidationCaller({
          ...sampleCreateStoreDto,
          userId: 1,
        }),
      ).toBe(true);
    });
  });

  describe('checkBusinessNumber', () => {
    // it('should return false if business number is not valid', async () => {
    //   const dto = '123-12-1234';
    //   expect(await storesService.checkBusinessNumberCaller(dto)).toBe(false);
    // });

    // it('should return true if business number is valid', async () => {
    //   const dto = '783-86-01715';
    //   expect(await storesService.checkBusinessNumberCaller(dto)).toBe(true);
    // });

    it('should call checkBusinessNumber', async () => {
      const mockCheckBusinessNumber = jest.spyOn(
        storesService,
        'checkBusinessNumber' as any,
      );
      mockCheckBusinessNumber.mockResolvedValue(true);

      const dto = '783-86-01715';
      expect(await storesService.checkBusinessNumber(dto)).toBe(true);

      expect(mockCheckBusinessNumber).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateStore', () => {
    it('should throw error if store is not owned', async () => {
      const sampleUpdateStoreDto: StoreUpdateDto = createSampleUpdateStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        storesService.updateStore(1, sampleUpdateStoreDto),
      ).rejects.toThrowError('Store not owned.');

      expect(mockCheckStoreOwned).toHaveBeenCalledWith({
        storeId: 1,
        userId: 1,
      });
    });

    it('should throw error if store status is not allowed', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const sampleUpdateStoreDto: StoreUpdateDto = createSampleUpdateStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup' as any,
      );
      mockCheckStoreStatusGroup.mockResolvedValue(false);

      await expect(
        storesService.updateStore(1, sampleUpdateStoreDto),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toHaveBeenCalledWith('REGISTERED', [
        'REGISTERED',
        'OPEN',
        'CLOSED',
      ]);
    });

    it('should throw error if validation fails', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const sampleUpdateStoreDto: StoreUpdateDto = createSampleUpdateStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup' as any,
      );
      mockCheckStoreStatusGroup.mockResolvedValue(true);

      const mockCheckValidation = jest.spyOn(
        storesService,
        'checkValidation' as any,
      );
      mockCheckValidation.mockResolvedValue(false);

      await expect(
        storesService.updateStore(1, sampleUpdateStoreDto),
      ).rejects.toThrowError('Validation failed.');

      expect(mockCheckValidation).toHaveBeenCalled();
    });

    it('should update store and return storeDto', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const sampleUpdateStoreDto: StoreUpdateDto = createSampleUpdateStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup' as any,
      );
      mockCheckStoreStatusGroup.mockResolvedValue(true);

      const mockCheckValidation = jest.spyOn(
        storesService,
        'checkValidation' as any,
      );
      mockCheckValidation.mockResolvedValue(true);

      const mockUpdate = jest.spyOn(storesReposiroty, 'update');
      mockUpdate.mockResolvedValue(sampleStoreDto);

      const result = await storesService.updateStore(1, sampleUpdateStoreDto);
      expect(result).toBe(sampleStoreDto);

      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('checkStoreOwned', () => {
    it('should find store by userId & storeId', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const mockFindOne = jest.spyOn(storesReposiroty, 'findOne');
      mockFindOne.mockResolvedValue(sampleStoreDto);

      const result = await storesService.checkStoreOwned({
        storeId: 1,
        userId: 1,
      });
      expect(result).toBe(sampleStoreDto);

      expect(mockFindOne).toHaveBeenCalledWith({ storeId: 1, userId: 1 });
    });
  });

  describe('checkStoreStatusGroup', () => {
    it('should return false if store status is not included', async () => {
      const result = await storesService.checkStoreStatusGroup(
        'TERMINATED' as StoreStatus,
        ['OPEN', 'CLOSED'] as StoreStatus[],
      );
      expect(result).toBe(false);
    });

    it('should return true if store status is included', async () => {
      const result = await storesService.checkStoreStatusGroup(
        'OPEN' as StoreStatus,
        ['OPEN', 'CLOSED'] as StoreStatus[],
      );
      expect(result).toBe(true);
    });
  });

  describe('changeStoreStatus', () => {
    it('should throw error if store is not owned', async () => {
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      await expect(
        storesService.changeStoreStatus(1, {
          storeId: 1,
          status: 'OPEN' as StoreStatus,
        }),
      ).rejects.toThrowError('Store not owned.');

      expect(mockCheckStoreOwned).toHaveBeenCalledWith({
        storeId: 1,
        userId: 1,
      });
    });

    it('should throw error if store status is not allowed', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const sampleUpdateStoreDto: StoreUpdateDto = createSampleUpdateStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup' as any,
      );
      mockCheckStoreStatusGroup.mockResolvedValue(false);

      await expect(
        storesService.updateStore(1, sampleUpdateStoreDto),
      ).rejects.toThrowError('Store status is not allowed.');

      expect(mockCheckStoreStatusGroup).toHaveBeenCalledWith('REGISTERED', [
        'REGISTERED',
        'OPEN',
        'CLOSED',
      ]);
    });

    it('should throw error if not meet store status change condition', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup' as any,
      );
      mockCheckStoreStatusGroup.mockResolvedValue(true);

      const checkStoreStatusChangeCondition = jest.spyOn(
        storesService,
        'checkStoreStatusChangeCondition' as any,
      );
      checkStoreStatusChangeCondition.mockResolvedValue(false);

      await expect(
        storesService.changeStoreStatus(1, {
          storeId: 1,
          status: 'CLOSED' as StoreStatus,
        }),
      ).rejects.toThrowError('Store status change condition not met.');

      expect(checkStoreStatusChangeCondition).toHaveBeenCalledWith(
        'REGISTERED',
        'CLOSED',
      );
    });

    it('should change store status and return StoreStatusDto', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any,
      );
      mockCheckStoreOwned.mockResolvedValue(sampleStoreDto);

      const mockCheckStoreStatusGroup = jest.spyOn(
        storesService,
        'checkStoreStatusGroup' as any,
      );
      mockCheckStoreStatusGroup.mockResolvedValue(true);

      const checkStoreStatusChangeCondition = jest.spyOn(
        storesService,
        'checkStoreStatusChangeCondition' as any,
      );
      checkStoreStatusChangeCondition.mockResolvedValue(true);

      const mockSave = jest.spyOn(storesReposiroty, 'update');
      mockSave.mockResolvedValue(sampleStoreDto);

      const result = await storesService.changeStoreStatus(1, {
        storeId: 1,
        status: 'CLOSED' as StoreStatus,
      });
      expect(result).toBe(sampleStoreDto);

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('checkStoreStatusChangeCondition', () => {
    it('shoud return false if status is not allowed', async () => {
      const result = await storesService.checkStoreStatusChangeCondition(
        'REGISTERED' as StoreStatus,
        'CLOSED' as StoreStatus,
      );
      expect(result).toBe(false);
    });

    it('shoud return true if status is allowed', async () => {
      const result = await storesService.checkStoreStatusChangeCondition(
        'OPEN' as StoreStatus,
        'CLOSED' as StoreStatus,
      );
      expect(result).toBe(true);
    });
  });

  describe('getStoresByBusinessUser', () => {
    it('should exec findAllByUserId', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const mockFindAllByUserId = jest.spyOn(
        storesReposiroty,
        'findAllByUserId' as any,
      );
      mockFindAllByUserId.mockResolvedValue([sampleStoreDto]);

      const result = await storesService.getStoresByBusinessUser(1);
      expect(result).toEqual([sampleStoreDto]);

      expect(mockFindAllByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('getStoreByStoreId', () => {
    it('should exec findOne', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const mockFindOne = jest.spyOn(storesReposiroty, 'findOne');
      mockFindOne.mockResolvedValue(sampleStoreDto);

      const result = await storesService.getStoreByStoreId(1);
      expect(result).toEqual(sampleStoreDto);

      expect(mockFindOne).toHaveBeenCalledWith({ storeId: 1 });
    });
  });

  describe('getStoresBySearch', () => {
    it('should exec findManyBySearch', async () => {
      const sampleStoreDto: StoreDto = createSampleStoreDto({})
      const mockFindManyBySearch = jest.spyOn(
        storesReposiroty,
        'findManyBySearch' as any,
      );
      mockFindManyBySearch.mockResolvedValue([sampleStoreDto]);

      const result = await storesService.getStoresBySearch({
        keyword: '커피',
        page: 1,
        limit: 10,
      });
      expect(result).toEqual([sampleStoreDto]);

      expect(mockFindManyBySearch).toHaveBeenCalledWith({
        keyword: '커피',
        page: 1,
        limit: 10,
      });
    });
  });
});
