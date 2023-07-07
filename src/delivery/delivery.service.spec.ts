import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { mockingOrderDto } from 'src/utils/mocking-helper/mocking-order';

import { DeliveryService } from './delivery.service';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let mockPrisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryService, PrismaService],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('start delivery', () => {
    it('order not exist', async () => {
      await expect(
        service.startDelivery(mockingOrderDto().orderId),
      ).rejects.toThrow(NotFoundException);
    });
    it('order status validation', async () => {
      await expect(
        service.startDelivery(mockingOrderDto().orderId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
