import { Test, TestingModule } from '@nestjs/testing';

import { CustomOrder } from './orders.entity';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Order Creation', () => {
    describe('Order Creates normally', () => {
      it('should return id value of the created order.', () => {
        const order1 = new CustomOrder('Junho');

        service.addOrder(order1);

        const result = service.Orders;
        console.log(service.Orders);
        expect(result).toContain(order1);
      });
    });
  });
});
