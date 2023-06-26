import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EnvService } from 'src/config/env';

import { StoresService } from './stores.service';
import { StoreCreateDto } from '../dto';

describe('StoresService', () => {
  let storesService: StoresService;
  let envService: EnvService;

  const MIN_COOKING_TIME = 5;
  const MAX_COOKING_TIME = 120;

  const sampleCreateStoreDto: StoreCreateDto = {
    name: '커피커피',
    type: 'CAFE',
    businessNumber: '123-12-12345',
    phoneNumber: '02-1234-1234',
    postalNumber: '06210',
    address: '서울 강남구 테헤란로44길 8 12층(아이콘역삼빌딩)',
    openingTime: 9,
    closingTime: 22,
    cookingTime: 10,
    origin: '커피원두(국내산), 우유(국내산)',
    description: '코딩이 맛있어요!',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [StoresService, EnvService],
    }).compile();

    storesService = module.get<StoresService>(StoresService);
    envService = module.get<EnvService>(EnvService);
  });

  it('should be defined', () => {
    expect(storesService).toBeDefined();
  });

  describe('createStore', () => {
    it('should checkValidation', async () => {
      const mockCheckValidation = jest.spyOn(storesService, 'checkValidation' as any);
      mockCheckValidation.mockResolvedValue(false);

      const result = await storesService.createStore(1, sampleCreateStoreDto);
      expect(result).toBe(false);

      expect(mockCheckValidation).toHaveBeenCalled();
    });

    it('should check store business number', () => {});

    it('should check store duplication', () => {});

    it('should delegate Store creation to repository', () => {});
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
      expect(await storesService.checkValidationCaller(sampleCreateStoreDto)).toBe(
        true,
      );
    });
  });
});
