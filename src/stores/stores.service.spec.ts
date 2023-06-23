import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { UsersService } from 'src/users/users.service';

describe('StoresService', () => {
  let storeService: StoresService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoresService, UsersService],
    }).compile();

    storeService = module.get<StoresService>(StoresService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(storeService).toBeDefined();
  });

    
  describe('createStore', () => {
    it('should check user type', async () => {});

    it('should check validation', async () => {});

    it('should check store name duplication', () => {});

    it('should check store business number', () => {});

    it('should delegate Store creation to repository', () => {});
  });
});
