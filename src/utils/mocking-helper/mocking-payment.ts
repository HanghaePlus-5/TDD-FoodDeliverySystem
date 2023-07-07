import { PaymentStatus } from '@prisma/client';

import { PaymentCreateDto } from 'src/payment/dto/payment-create.dto';
import { PaymentDto } from 'src/payment/dto/payment.dto';

export function mockingPaymentInfo(dto? : Partial<PaymentCreateDto>) : PaymentCreateDto {
    return {
        cardExpiryMonth: 6,
        cardExpiryYear: 2027,
        cardHolderName: 'michael',
        cardIssuer: 'abc',
        cardNumber: '1111-1111-1111-1121',
        paymentStatus: PaymentStatus.completed,
        ...dto,
    };
}
