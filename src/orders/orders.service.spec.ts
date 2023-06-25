import { Test, TestingModule } from '@nestjs/testing';
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
        const order = undefined;
        const result = undefined;
        expect(result).toBe(true);
      });

    });
  });
});
