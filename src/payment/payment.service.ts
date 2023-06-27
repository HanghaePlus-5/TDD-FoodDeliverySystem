import {
  BadRequestException, HttpCode, HttpException, HttpStatus, Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { PaymentDto } from 'src/payment/dto/payment.dto';
import { Payment, Prisma } from '@prisma/client';
import { create } from 'domain';
import { PaymentCreateDto } from './dto/payment-create.dto';
import { PaymentGatewayResponseDto } from '../lib/payment-gateway/dto/payment-gateway-response.dto';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pgService: PaymentGatewayService,
  ) { }
   create(paymentInfo : PaymentCreateDto) :Promise<Payment| null>  {
    const data: Prisma.PaymentCreateInput = paymentInfo
    return this.prisma.payment.create({ data });
  }


  // payment request
  async makePayment(paymentInfo: PaymentCreateDto, customerName: string)  {
    if (!this.validatePaymentInfo(paymentInfo, customerName)) throw new BadRequestException();

    try {
      const response = await this.pgService.sendPaymentRequestToPG(paymentInfo);
      if (response.status == HttpStatus.ACCEPTED) {
        const payment = await this.create(paymentInfo)
        return payment
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  validatePaymentInfo(paymentInfo: PaymentCreateDto, customerName: string) {
    return this.validateCardHolder(paymentInfo.cardHolderName, customerName)
      && this.validateCardNumber(paymentInfo.cardNumber);
  }
  validateCardHolder(cardHolderName: string, customerName: string) {
    return cardHolderName === customerName;
  }
  validateCardNumber(cardNumber: string) {
    cardNumber = cardNumber.replace(/[-\s]/g, '');
    return cardNumber.length === 16;
  }




  // cancel request
  cancelPayment() {

  }
  updatePaymentStatus() {

  }

  async findByPaymentId(paymentId: number) {
    const where: Prisma.PaymentWhereUniqueInput = { paymentId: paymentId }
    return this.prisma.payment.findUnique({ where })
  }

  isCompletedPayment(paymentStatus: string) {
    return paymentStatus == "payment completed"
  }
}
