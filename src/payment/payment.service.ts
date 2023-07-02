import {
  Injectable, NotFoundException,
} from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';

import { PrismaService } from 'src/prisma';
import { PaymentGatewayService } from 'src/lib/payment-gateway/payment-gateway.service';

import { validateCardHolder, validateCardNumber, validatePaymentStatus } from './func';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pgService: PaymentGatewayService,
  ) { }
  async makePayment(args: PaymentProcessArgs): Promise<Payment> {
    const { paymentCreateDto: paymentInfo, user, order } = args;
    console.log('user', user);
    validateCardHolder(paymentInfo.cardHolderName, user.name);
    validateCardNumber(paymentInfo.cardNumber);
    const response = await this.pgService.sendPaymentRequestToPG(paymentInfo);
    const data = { ...paymentInfo, paymentGatewayId: response.data.paymentGatewayId, orderId: order.orderId };
    const payment = await this.prisma.payment.create({ data });
    return payment;
  }

  async cancelPayment(orderId: number): Promise<Payment> {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('payment not exist');
    validatePaymentStatus(payment.paymentStatus);
    await this.pgService.sendCancelRequestToPG(payment.paymentGatewayId);
    const updatedPayment = await this.prisma.payment.update({ where: { orderId }, data: { paymentStatus: PaymentStatus.canceled, updatedAt: new Date() } });
    return updatedPayment;
  }
}
