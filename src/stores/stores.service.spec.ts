import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { UsersService } from 'src/users/users.service';

describe('StoresService', () => {
  let storesService: StoresService;
  let usersService: any;

  const MIN_COOKING_TIME: number = parseInt(
    process.env.MIN_COOKING_TIME || '5'
  );
  const MAX_COOKING_TIME: number = parseInt(
    process.env.MIN_COOKING_TIME || '120'
  );

  const sampleCreateStoreDto = {
    name: '커피커피',
    type: '카페',
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
      providers: [
        StoresService,
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    storesService = module.get<StoresService>(StoresService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(storesService).toBeDefined();
  });

  describe('createStore', () => {
    it('should handle error when getUser fail', async () => {
      const userId = 1;
      const mockGetUser = jest.fn().mockRejectedValue(null);
      usersService.getUser = mockGetUser;

      await expect(storesService.createStore(userId, null)).rejects.toThrow();
    });

    it('should checkValidation', async () => {
      const mockCheckValidation = jest.spyOn(storesService, 'checkValidation');
      mockCheckValidation.mockResolvedValue(false);

      await expect(storesService.createStore(1, null)).rejects.toThrow();
      expect(mockCheckValidation).toHaveBeenCalled();
      expect(mockCheckValidation).toHaveReturnedWith(false);
    });

    it('should check store name duplication', () => {});

    it('should check store business number', () => {});

    it('should delegate Store creation to repository', () => {});
  });

  describe('checkValidation', () => {
    it('should not include store name english', () => {
      const dto = { name: 'english' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include store name special character', () => {
      const dto = { name: '커피 커피' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should include store type', () => {
      const dto = { type: '' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should include businessNumber length 12', () => {
      const dto = { businessNumber: '123-12-1234' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should include phoneNumber as string', () => {
      const dto = { phoneNumber: 12345678901 };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include phoneNumber length < 11', () => {
      const dto = { phoneNumber: '02-123-123' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include phoneNumber length > 13', () => {
      const dto = { phoneNumber: '031-1234-12345' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should include postalNumber as string', () => {
      const dto = { postalNumber: 12345 };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should include postalNumber length 5', () => {
      const dto = { postalNumber: '1234' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include openingTime over 23', () => {
      const dto = { openingTime: 24 };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include closingTime under 0', () => {
      const dto = { closingTime: -1 };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include cookingTime under min time', () => {
      const dto = { cookingTime: MIN_COOKING_TIME - 1 };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include cookingTime over max time', () => {
      const dto = { cookingTime: MAX_COOKING_TIME + 1 };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should pass validation', () => {
      expect(storesService.checkValidation(sampleCreateStoreDto)).toBe(true);
    });
  });
});
