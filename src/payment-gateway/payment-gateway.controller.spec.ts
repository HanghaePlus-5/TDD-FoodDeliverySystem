import { Test, TestingModule } from '@nestjs/testing';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PaymentGatewayService } from './payment-gateway.service';

describe('PaymentGatewayController', () => {
  let controller: PaymentGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentGatewayController],
      providers: [PaymentGatewayService],
    }).compile();

    controller = module.get<PaymentGatewayController>(PaymentGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
