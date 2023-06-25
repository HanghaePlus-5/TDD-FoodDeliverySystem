import {
  BadRequestException, HttpCode, HttpException, HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PaymentDto } from 'src/payment/dto/payment.dto';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send payment request to payment-gateway', () => {
    const paymentDto : PaymentDto = {
      cardExpiryMonth: 6,
      cardExpiryYear: 2027,
      cardHolderName: 'michael',
      cardIssuer: 'abc',
      cardNumber: '1111-1111-1111-1121',
    };
    const orderInfo = {
      customerName: 'michael',
    };
    describe('validate payment-info', () => {
      it('should return false if user and card holder name are different', () => {
        const cardHolderName = 'foo';
        const customerName = 'poo';
        expect(service._validCardHolder(cardHolderName, customerName)).toBe(false);
      });
      it('should return false with invalid card number format', () => {
        const cardNumber = '4124-1244-4124-414';
        expect(service._validateCardNumber(cardNumber)).toBe(false);
      });
    });
    describe('paymentRequest to PG', () => {
      it('should throw error if failed', () => {
        const mock = { ...paymentDto, cardNumber: '1111-1111-1111-1111' };
        expect(() => service.sendPaymentRequestToPG(mock, orderInfo.customerName)).toThrow(BadRequestException);
      });
      it('should return ACCEPTED if successful', () => {
        const mock = { ...paymentDto, cardNumber: '1111-1111-1111-1112' };
        expect(service.sendPaymentRequestToPG(mock, orderInfo.customerName)).toBe(HttpStatus.ACCEPTED);
      });
    });
  });
});
