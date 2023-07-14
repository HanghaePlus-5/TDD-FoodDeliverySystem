import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, StoreStatus, StoreType } from '@prisma/client';

import { PrismaService } from 'src/prisma';

import { UserType } from "src/types";
import { DeliveryService } from "./delivery.service";

describe.skip('DeliveryService', () => {
  let service: DeliveryService;
  let testPrisma: PrismaClient;

  let orderIdNotExist: number;
  let orderIdForDelivery: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryService, PrismaService],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    testPrisma = module.get(PrismaService);

    const random = Math.floor(Math.random() * 1000) + 1;

    const user = await testPrisma.user.create({
      data: {
        email: `michael${random}@gmail.com`,
        name: "michael",
        password: "qwer123123",
        type: UserType.CUSTOMER,
      },
    });

    const store = await testPrisma.store.create({
      data: {
        name: `Sample Store${random}`,
        type: StoreType.KOREAN,
        status: StoreStatus.OPEN,
        businessNumber: `1234567890${random}`,
        phoneNumber: "010-1234-5678",
        postalNumber: "12345",
        address: "Seoul, Korea",
        openingTime: 1,
        closingTime: 1,
        cookingTime: 1,
      },
    });

    const order = await testPrisma.order.create({
      data: {
        userId: user.userId,
        storeId: store.storeId,
      },
    });

    orderIdNotExist = 123123;
    orderIdForDelivery = order.orderId

    
  });
  afterAll(async () => {
    const deleteUser = testPrisma.user.deleteMany();
    const deleteStore = testPrisma.store.deleteMany();
    const deleteOrder = testPrisma.order.deleteMany();
    await testPrisma.$transaction([
      deleteOrder,
      deleteUser,
      deleteStore,
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('start delivery', () => {
    it('order not exist', async () => {
      await expect(
        service.startDelivery(orderIdNotExist),
      ).rejects.toThrow(NotFoundException);
    });
    it('order status validation', async () => {
      await expect(
        service.startDelivery(orderIdForDelivery),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
