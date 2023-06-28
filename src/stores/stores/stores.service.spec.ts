import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { EnvService } from 'src/config/env';

import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';
import { StoreCreateDto, StoreDto } from '../dto';
import { StoreUpdateDto } from '../dto/store-update.dto';

describe('StoresService', () => {
  let storesService: StoresService;
  let storesReposiroty: StoresRepository;
  let envService: EnvService;

  const MIN_COOKING_TIME = 5;
  const MAX_COOKING_TIME = 120;

  const sampleCreateStoreDto: StoreCreateDto = {
    name: '커피커피',
    type: 'CAFE',
    businessNumber: '783-86-01715',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
  };

  const sampleUpdateStoreDto: StoreUpdateDto = {
    storeId: 1,
    name: '커피커피',
    type: 'CAFE',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
  };

  const sampleStoreDto: StoreDto = {
    storeId: 1,
    name: '커피커피',
    type: 'CAFE',
    status: 'REGISTERED',
    businessNumber: '783-86-01715',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    reviewNumber: 0,
    averageScore: 0,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
    registrationDate: new Date(),
    userId: 1,
  };

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
    it('should checkValidation', async () => {
      const mockCheckValidation = jest.spyOn(
        storesService,
        'checkValidation' as any
      );
      mockCheckValidation.mockResolvedValue(false);

      const result = await storesService.createStore(1, sampleCreateStoreDto);
      expect(result).toBe(false);

      expect(mockCheckValidation).toHaveBeenCalled();
    });

    it('should check store business number', async () => {
      const mockCheckBusinessNumber = jest.spyOn(
        storesService,
        'checkBusinessNumber' as any
      );
      mockCheckBusinessNumber.mockResolvedValue(false);

      const result = await storesService.createStore(1, sampleCreateStoreDto);
      expect(result).toBe(false);

      expect(mockCheckBusinessNumber).toHaveBeenCalled();
    });

    it('should delegate Store creation to repository', async () => {
      const mockcreate = jest.spyOn(storesReposiroty, 'create');
      mockcreate.mockResolvedValue(sampleStoreDto);

      const result = await storesService.createStore(1, sampleCreateStoreDto);
      expect(result).toBe(true);

      expect(mockcreate).toHaveBeenCalledWith({
        ...sampleCreateStoreDto,
        userId: 1,
      });
    });
  });

  describe('checkValidation', () => {
    it('should include store name length > 0', async () => {
      const dto = { ...sampleCreateStoreDto, name: '' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include store name english', async () => {
      const dto = { ...sampleCreateStoreDto, name: 'english' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include store name special character', async () => {
      const dto = { ...sampleCreateStoreDto, name: '커피커피!' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should include businessNumber length 12', async () => {
      const dto = { ...sampleCreateStoreDto, businessNumber: '123-12-1234' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include phoneNumber length < 11', async () => {
      const dto = { ...sampleCreateStoreDto, phoneNumber: '02-123-123' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include phoneNumber length > 13', async () => {
      const dto = { ...sampleCreateStoreDto, phoneNumber: '031-1234-12345' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should include postalNumber length 5', async () => {
      const dto = { ...sampleCreateStoreDto, postalNumber: '1234' };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include openingTime over 23', async () => {
      const dto = { ...sampleCreateStoreDto, openingTime: 24 };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include closingTime under 0', async () => {
      const dto = { ...sampleCreateStoreDto, closingTime: -1 };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include cookingTime under min time', async () => {
      const dto = {
        ...sampleCreateStoreDto,
        cookingTime: MIN_COOKING_TIME - 1,
      };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should not include cookingTime over max time', async () => {
      const dto = {
        ...sampleCreateStoreDto,
        cookingTime: MAX_COOKING_TIME + 1,
      };
      expect(await storesService.checkValidationCaller(dto)).toBe(false);
    });

    it('should pass validation', async () => {
      expect(
        await storesService.checkValidationCaller({
          ...sampleCreateStoreDto,
          userId: 1,
        })
      ).toBe(true);
    });
  });

  describe('checkBusinessNumber', () => {
    it('should return false if business number is not valid', async () => {
      const dto = '123-12-1234';
      expect(await storesService.checkBusinessNumberCaller(dto)).toBe(false);
    });

    it('should return true if business number is valid', async () => {
      const dto = '783-86-01715';
      expect(await storesService.checkBusinessNumberCaller(dto)).toBe(true);
    });
  });

  describe('updateStore', () => {
    it('should exec checkStoreOwned', async () => {
      const mockCheckStoreOwned = jest.spyOn(
        storesService,
        'checkStoreOwned' as any
      );
      mockCheckStoreOwned.mockResolvedValue(null);

      const result = await storesService.updateStore(1, sampleUpdateStoreDto);
      expect(result).toBe(false);

      expect(mockCheckStoreOwned).toHaveBeenCalledWith({
        storeId: 1,
        userId: 1,
      });
    });
  });

  describe('checkStoreOwned', () => {
    it('should find store by userId & storeId', async () => {
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
    it('should return false if store status is TERMINATED', async () => {
      const result = await storesService.checkStoreStatusGroup(
        'TERMINATED' as StoreStatus,
        ['OPEN', 'CLOSED'] as StoreStatus[]
      );
      expect(result).toBe(false);
    });
  });
});
