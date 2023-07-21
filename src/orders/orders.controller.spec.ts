import { Test, TestingModule } from '@nestjs/testing';
import { AsyncLocalStorage } from 'node:async_hooks';

import { PrismaService, PrismaService } from 'src/prisma';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        PrismaService,
        AsyncLocalStorage,
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
