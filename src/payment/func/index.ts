import { BadRequestException } from '@nestjs/common';
import { Payment } from '@prisma/client';

import { PaymentStatus } from 'src/types';

export function validateCardHolder(cardHolderName: string, customerName: string) {
    if (cardHolderName !== customerName) {
        throw new BadRequestException('card holder name and user name are different')
    };
}
export function validateCardNumber(cardNumber: string) {
    cardNumber = cardNumber.replace(/[-\s]/g, '')
    if (cardNumber.length !== 16) {
        throw new BadRequestException('card number is not valid');
    }
}
export function validatePaymentStatus(paymentStatus: PaymentStatus) {
    if (paymentStatus !== PaymentStatus.completed) {
        throw new BadRequestException('payment status is not `completed`');
    }
}
