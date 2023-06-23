import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';

describe('StoresService', () => {
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoresService],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    
  describe('createStore', () => {
    it('should check user type', async () => {});

    it('should check validation', async () => {});

    it('should check store name duplication', () => {});

    it('should check store business number', () => {});

    it('should delegate Store creation to repository', () => {});
  });
});
