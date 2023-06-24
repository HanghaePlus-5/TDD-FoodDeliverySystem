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

    it('should include phoneNumber as number', () => {
      const dto = { phoneNumber: '02-123-1234' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include phoneNumber length < 9', () => {
      const dto = { phoneNumber: '01234567' };
      expect(storesService.checkValidation(dto)).toBe(false);
    });

    it('should not include phoneNumber length > 11', () => {
      const dto = { phoneNumber: '012345678901' };
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
  });
});
