import { Test, TestingModule } from '@nestjs/testing';

import { createResponse } from 'src/utils/createResponse';
import { StoreDto } from 'src/stores/dto';
import { StoresController } from 'src/stores/stores/stores.controller';
import { StoresService } from 'src/stores/stores/stores.service';

import {
 createSampleCreateStoreDto, createSampleStoreDto, createSampleUpdateStoreDto, createSampleUserPayloadBusiness,
} from '../testUtils';

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
            updateStore: jest.fn(),
            changeStoreStatus: jest.fn(),
          },
        },
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
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();
      const mockCreateStore = jest.spyOn(service, 'createStore').mockResolvedValue(sampleStoreDto);
      const req: Express.Request = { payload: sampleUserPayloadBusiness } as Express.Request;

      await expect(controller.createStore(req, sampleCreateStoreDto)).resolves.toEqual(createResponse<StoreDto>(sampleStoreDto));
      expect(mockCreateStore).toBeCalledWith(req.payload, sampleCreateStoreDto);
    });
  });

  describe('updateStore', () => {
    it('should return a store', async () => {
      const sampleStoreDto = createSampleStoreDto();
      const sampleUpdateStoreDto = createSampleUpdateStoreDto();
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();
      const mockUpdateStore = jest.spyOn(service, 'updateStore').mockResolvedValue(sampleStoreDto);
      const req: Express.Request = { payload: sampleUserPayloadBusiness } as Express.Request;

      await expect(controller.updateStore(req, sampleUpdateStoreDto)).resolves.toEqual(createResponse<StoreDto>(sampleStoreDto));
      expect(mockUpdateStore).toBeCalledWith(req.payload, sampleUpdateStoreDto);
    });
  });

  describe('changeStoreStatus', () => {
    it('should return a store', async () => {
      const sampleStoreDto = createSampleStoreDto();
      const sampleStoreChangeStatusDto = { storeId: sampleStoreDto.storeId, status: sampleStoreDto.status };
      const sampleUserPayloadBusiness = createSampleUserPayloadBusiness();
      const mockChangeStoreStatus = jest.spyOn(service, 'changeStoreStatus').mockResolvedValue(sampleStoreDto);
      const req: Express.Request = { payload: sampleUserPayloadBusiness } as Express.Request;

      await expect(controller.changeStoreStatus(req, sampleStoreChangeStatusDto)).resolves.toEqual(createResponse<StoreDto>(sampleStoreDto));
      expect(mockChangeStoreStatus).toBeCalledWith(req.payload, sampleStoreChangeStatusDto);
    });
  });
});
