import { Test, TestingModule } from '@nestjs/testing';

import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { PrismaService } from 'src/prisma';

describe('DeliveryController', () => {
  let controller: DeliveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [DeliveryService, PrismaService],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
