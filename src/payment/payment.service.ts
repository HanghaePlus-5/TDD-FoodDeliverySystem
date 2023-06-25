import {
  BadRequestException, HttpCode, HttpException, HttpStatus, Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { PaymentDto } from 'src/payment/dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // payment request
  makePayment(paymentInfo : PaymentDto, customerName:string) {
    if (!this.validatePaymentInfo(paymentInfo, customerName)) throw new BadRequestException();

    try {
      this.sendPaymentRequestToPG(paymentInfo);
    // create payment data
    // return PaymentDto or Success
    } catch (error) {
      throw new Error(error);
    }
  }
  sendPaymentRequestToPG(paymentInfo : PaymentDto) {
    if (paymentInfo.cardNumber === '1111-1111-1111-1111') throw new BadRequestException();
    return HttpStatus.ACCEPTED;
  }
  validatePaymentInfo(paymentInfo : PaymentDto, customerName : string) {
    return this.validateCardHolder(paymentInfo.cardHolderName, customerName)
            && this.validateCardNumber(paymentInfo.cardNumber);
  }
  validateCardHolder(cardHolderName : string, customerName : string) {
    return cardHolderName === customerName;
  }
  validateCardNumber(cardNumber:string) {
    cardNumber = cardNumber.replace(/[-\s]/g, '');
    return cardNumber.length === 16;
  }

  // cancel request
  cancelPayment() {

  }
  sendCancelRequestToPG() {

  }
  validateCancelRequest() {

  }

  isExistingOrder() {

  }
  isOrderStatusAccepted() {

  }
  isPaymentStatusCompleted() {

  }
}
