import { PaymentCreateDto } from 'src/payment/dto/payment-create.dto';
import { Order } from "@prisma/client";

export const PaymentStatus = {
  completed: 'completed',
  canceled: 'canceled',
} as const;
declare global {
  type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

  interface Payment {
    paymentId: number;
    orderId: number;
    cardNumber: string;
    cardExpiryMonth: number;
    cardExpiryYear: number;
    cardHolderName: string;
    cardIssuer: string;
    paymentGatewayId: string;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
  }

  interface PaymentProcessArgs {
    order: Order;
    user: User;
    paymentCreateDto: PaymentCreateDto;
  }
}
