import { Test, TestingModule } from '@nestjs/testing';
import { PaymentGatewayService } from './payment-gateway.service';

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentGatewayService],
    }).compile();

    service = module.get<PaymentGatewayService>(PaymentGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
