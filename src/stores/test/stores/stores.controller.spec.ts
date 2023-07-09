import { Test, TestingModule } from '@nestjs/testing';

import { StoresController } from 'src/stores/stores/stores.controller';
import { StoresService } from 'src/stores/stores/stores.service';
import { createSampleCreateStoreDto, createSampleStoreDto } from '../testUtils';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: {
            createStore: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStore', () => {
    it('should return a store', async () => {
      const sampleStoreDto = createSampleStoreDto();
      const sampleCreateStoreDto = createSampleCreateStoreDto();
      const mockCreateStore = jest.spyOn(service, 'createStore').mockResolvedValue(sampleStoreDto);
      const req: Express.Request = {
        payload: { userId: 1 },
      } as Express.Request;

      await expect(controller.createStore(req, sampleCreateStoreDto)).resolves.toEqual(sampleStoreDto);
      expect(mockCreateStore).toBeCalledWith(1, sampleCreateStoreDto);
    });
  })
});
