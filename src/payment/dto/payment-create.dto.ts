import { PaymentDto } from "./payment.dto";

export type PaymentCreateDto = Pick<PaymentDto, 'cardNumber'|'cardExpiryMonth'|'cardExpiryYear'|'paymentGatewayId'|'cardHolderName'|'cardIssuer'>

