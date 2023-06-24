import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { UsersService } from 'src/users/users.service';
import { async } from 'rxjs';

describe('StoresService', () => {
  let storesService: StoresService;
  let usersService: any;

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

      await expect(storesService.createStore(userId)).rejects.toThrow(
        'Invalid userId'
      );
    });

    it('should check user type as business', async () => {
      const userId = 1;
      const mockGetUser = jest.fn().mockResolvedValue({ userType: 'customer' });
      usersService.getUser = mockGetUser;

      await expect(storesService.createStore(userId)).rejects.toThrow(
        'Invalid userType'
      );
    });

    it('should check validation', async () => {});

    it('should check store name duplication', () => {});

    it('should check store business number', () => {});

    it('should delegate Store creation to repository', () => {});
  });
});
