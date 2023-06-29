import {
  BadRequestException,
  HttpStatus, Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

import { PaymentCreateDto } from './dto/payment-create.dto';
import { validatePaymentStatus, validateCardHolder, validateCardNumber } from './func';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pgService: PaymentGatewayService,
  ) { }
  // payment request
  async makePayment(data: PaymentCreateDto, orderDto: any) {
    validateCardHolder(data.cardHolderName, orderDto.customerName)
    validateCardNumber(data.cardNumber)
    const response = await this.pgService.sendPaymentRequestToPG(data);
    if (response.status === HttpStatus.ACCEPTED) {
      const payment = await this.prisma.payment.create({ data });
      return payment;
    }
  }

  // cancel request
  async cancelPayment(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({ where: { paymentId } });
    if (!payment) throw new BadRequestException('payment not exist');
    validatePaymentStatus(payment.paymentStatus)
    const response = await this.pgService.sendCancelRequestToPG(payment.paymentGatewayId);
    if (response.status === HttpStatus.ACCEPTED) {
      // payment status update
      return payment;
    }

  }
}
