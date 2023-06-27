import {
  BadRequestException, HttpCode, HttpException, HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { PaymentDto } from 'src/payment/dto/payment.dto';

import { PaymentService } from './payment.service';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

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
    paymentGatewayId: "1"
  };
  const paymentDto = {
    ...paymentCreateDto,
    paymentId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const orderInfo = {
    customerName: 'michael',
  };
  describe('send payment request to payment-gateway', () => {
    describe('validate payment request', () => {
      it('should return false if user and card holder name are different', () => {
        const cardHolderName = 'foo';
        const customerName = 'poo';
        expect(service.validateCardHolder(cardHolderName, customerName)).toBe(false);
      });
      it('should return false with invalid card number format', () => {
        const cardNumber = '4124-1244-4124-414';
        expect(service.validateCardNumber(cardNumber)).toBe(false);
      });
    });
    // describe('paymentRequest to PG', () => {
    //   it('should throw error if failed', () => {
    //     const mock = { ...paymentCreateDto, cardNumber: '1111-1111-1111-1111' };
    //     expect(() => service.sendPaymentRequestToPG(mock)).toThrow(BadRequestException);
    //   });
    //   it('should return ACCEPTED if successful', () => {
    //     const mock = { ...paymentCreateDto, cardNumber: '1111-1111-1111-1112' };
    //     expect(service.sendPaymentRequestToPG(mock)).toBe(HttpStatus.ACCEPTED);
    //   });
    // });
  });

  describe('cancelRequest to PG', () => {
    describe('validate cancel request', () => {
      it('should return false if payment data does not exist', async () => {
        mockPrisma.payment.findUnique.mockResolvedValueOnce(null);
        const paymentId = 10;
        expect(await service.findByPaymentId(paymentId)).toBe(null);
      });
      it('should return false if payment status is not `payment completed`', () => {
        const paymentStatus = 'payment canceled';
        expect(service.isCompletedPayment(paymentStatus)).toBe(false);
      });
    });
  });
});
