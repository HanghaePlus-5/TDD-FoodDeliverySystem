import { PaymentDto } from './payment.dto';

export type PaymentCreateDto = Omit<PaymentDto, 'paymentId'>
