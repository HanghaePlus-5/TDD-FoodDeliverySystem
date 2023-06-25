import {
  BadRequestException, HttpCode, HttpException, HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'src/prisma';
import { PaymentDto } from 'src/payment/dto/payment.dto';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile(); service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const paymentDto : PaymentDto = {
    paymentId: 1,
    cardExpiryMonth: 6,
    cardExpiryYear: 2027,
    cardHolderName: 'michael',
    cardIssuer: 'abc',
    cardNumber: '1111-1111-1111-1121',
  };
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
    describe('paymentRequest to PG', () => {
      it('should throw error if failed', () => {
        const mock = { ...paymentDto, cardNumber: '1111-1111-1111-1111' };
        expect(() => service.sendPaymentRequestToPG(mock)).toThrow(BadRequestException);
      });
      it('should return ACCEPTED if successful', () => {
        const mock = { ...paymentDto, cardNumber: '1111-1111-1111-1112' };
        expect(service.sendPaymentRequestToPG(mock)).toBe(HttpStatus.ACCEPTED);
      });
    });
  });

  describe('cancelRequest to PG', () => {
    describe('validate cancel request', () => {
      it('should return false if order data is not exist', () => {
        const orderId = '10';
        expect(service.isExistingOrder()).toBe(false);
      });
      it('should return false if order status is not `ORDER ACCEPTED`', () => {
        const oderStatus = 'ORDER CONFIRMED';
        expect(service.isOrderStatusAccepted()).toBe(false);
      });
      it('should return false if payment status is not `payment completed`', () => {
        const paymentStatus = 'payment canceled';
        expect(service.isPaymentStatusCompleted()).toBe(false);
      });
    });
  });
});
