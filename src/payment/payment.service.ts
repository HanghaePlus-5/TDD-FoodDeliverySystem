import {
  BadRequestException,
  HttpStatus, Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

import { PaymentCreateDto } from './dto/payment-create.dto';
import { validatePaymentStatus, validateCardHolder, validateCardNumber } from './func';
import { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pgService: PaymentGatewayService,
  ) { }
  // payment request
  async makePayment(paymentCreateDto: PaymentCreateDto, orderDto: any): Promise<Payment> {
    validateCardHolder(paymentCreateDto.cardHolderName, orderDto.customerName);
    validateCardNumber(paymentCreateDto.cardNumber);
    const response = await this.pgService.sendPaymentRequestToPG(paymentCreateDto);
    const data = { ...paymentCreateDto, paymentGatewayId: response.data.paymentGatewayId, orderId : orderDto.orderId }
    const payment = await this.prisma.payment.create({ data });
    return payment;
  }

  // cancel request
  async cancelPayment(paymentId: number): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { paymentId } });
    if (!payment) throw new BadRequestException('payment not exist');
    validatePaymentStatus(payment.paymentStatus);
    await this.pgService.sendCancelRequestToPG(payment.paymentGatewayId);
    const updatedPayment = await this.prisma.payment.update({ where: { paymentId }, data: { paymentStatus: PaymentStatus.canceled } })
    return updatedPayment;
  }
}
