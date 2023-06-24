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

    it('should not include store name english', async () => {
      const dto = { name: 'english' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include store name special character', async () => {
      const dto = { name: '커피 커피' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should include store type', async () => {
      const dto = { type: '' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should include businessNumber length 12', async () => {
      const dto = { businessNumber: '123-12-1234' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should include phoneNumber as number', async () => {
      const dto = { phoneNumber: '02-123-1234' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include phoneNumber length < 9', async () => {
      const dto = { phoneNumber: '01234567' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include phoneNumber length > 11', async () => {
      const dto = { phoneNumber: '012345678901' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should include postalNumber length 5', async () => {
      const dto = { postalNumber: '1234' };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include openingTime over 23', async () => {
      const dto = { openingTime: 24 };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include closingTime under 0', async () => {
      const dto = { closingTime: -1 };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include cookingTime under min time', async () => {
      const dto = { cookingTime: MIN_COOKING_TIME - 1 };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should not include cookingTime over max time', async () => {
      const dto = { cookingTime: MAX_COOKING_TIME + 1 };
      await expect(storesService.checkValidation(dto)).rejects.toThrow();
    });

    it('should check store name duplication', () => {});

    it('should check store business number', () => {});

    it('should delegate Store creation to repository', () => {});
  });

});
