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

      it('should create an Order that is status of "paymentProcessing"', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
    });
    describe('Order General Validation Check', () => {
      it('should return false if business ueser tries to make an order', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
      it('should return false if a user tries to make an order from a non-existing store', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
      it('should return false if a user tries to make an order of a non-existing item', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });

    });
    describe('Order Business Validation Check', () => {
      it('should return false if a user tries to make an order of more than 10 item', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
      it('should return false if a user tries to make an order of 0 item', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
      it('should return false if a user tries to make an order while incomplete order exists', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
      it('should return false if a user tries to make an order with not enough stock', () => {
        const order1 = new CustomOrder('Test');
        expect(order1).toBe(false);
      });
    });

  });
});
