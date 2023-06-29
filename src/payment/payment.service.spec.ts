import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

import { PaymentService } from './payment.service';

import { PaymentStatus } from 'src/types';

describe('PaymentService', () => {
  let service: PaymentService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, PrismaService, PaymentGatewayService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<PaymentService>(PaymentService);
    mockPrisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const paymentCreateDto = {
    cardExpiryMonth: 6,
    cardExpiryYear: 2027,
    cardHolderName: 'michael',
    cardIssuer: 'abc',
    cardNumber: '1111-1111-1111-1121',
    paymentGatewayId: '1',
    paymentStatus: PaymentStatus.completed,
  };
  const paymentDto = {
    ...paymentCreateDto,
    paymentId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const orderDto = {
    customerName: 'michael',
    paymentId: 10,
  };
  const issue = (issue: string) => {
    return `Not throwing error with${issue}`;
  };

  describe('send payment request to payment-gateway', () => {
    describe('validate payment request', () => {
      it(issue('unathorized card holder'), async () => {
        const mOrderDto = { ...orderDto, customerName: 'dan' };
        await expect(service.makePayment(paymentCreateDto, mOrderDto)).rejects.toThrow();
      });
      it(issue('invalid card number format'), async () => {
        const mPayment = { ...paymentCreateDto, cardNumber: '4124-1244-4124-414' };
        await expect(service.makePayment(mPayment, orderDto)).rejects.toThrow();
      });
    });
    describe('payment request to PG', () => {
      it(issue('unacceptable card'), async () => {
        const mock = { ...paymentCreateDto, cardNumber: '1111-1111-1111-1111' };
        await expect(service.makePayment(mock, orderDto)).rejects.toThrow();
      });
    });
  });

  describe('cancel payment request', () => {
    describe('validate cancel request', () => {
      it(issue('no payment data'), async () => {
        mockPrisma.payment.findUnique.mockResolvedValueOnce(null);
        await expect(service.cancelPayment(orderDto.paymentId)).rejects.toThrow();
      });
      it(issue('status which is not completed'), async () => {
        mockPrisma.payment.findUnique.mockResolvedValueOnce({ ...paymentDto, paymentStatus: PaymentStatus.canceled });
        await expect(service.cancelPayment(orderDto.paymentId)).rejects.toThrow();
      });
    });

    describe('cancel request to PG', () => {
      it(issue('invalid paymentId'), async () => {
        mockPrisma.payment.findUnique.mockResolvedValueOnce({ ...paymentDto, paymentGatewayId: '123456' });
        await expect(service.cancelPayment(orderDto.paymentId)).rejects.toThrow();
      });
    });
  });
});
