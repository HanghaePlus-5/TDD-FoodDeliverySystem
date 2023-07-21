import { Test, TestingModule } from '@nestjs/testing';
import { AsyncLocalStorage } from 'node:async_hooks';

import { PrismaService } from 'src/prisma';

import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

describe('DeliveryController', () => {
  let controller: DeliveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        DeliveryService,
        PrismaService,
        AsyncLocalStorage,
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
