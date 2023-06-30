import { PaymentStatus } from "@prisma/client";
import { PaymentCreateDto } from "src/payment/dto/payment-create.dto";
import { PaymentDto } from "src/payment/dto/payment.dto";

export function mockingPaymentCreateDto(dto? : Partial<PaymentCreateDto>) : PaymentCreateDto {
    return {
        cardExpiryMonth: 6,
        cardExpiryYear: 2027,
        cardHolderName: 'michael',
        cardIssuer: 'abc',
        cardNumber: '1111-1111-1111-1121',
        paymentStatus: PaymentStatus.completed,
        ...dto,
    }
}
export function paymentDto(dto : Partial<PaymentDto>) : PaymentDto{
    return {
        paymentGatewayId : "1",
        cardExpiryMonth : 1,
        cardExpiryYear : 2021,
        cardHolderName : "dan",
        cardIssuer : "kb",
        paymentStatus : PaymentStatus.canceled,
        orderId : 2,
        cardNumber : '2222-2222-2222-2222',
        paymentId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dto
    }
}