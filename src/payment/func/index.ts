import { PaymentStatus } from 'src/types';

export function validateCardHolder(cardHolderName: string, customerName: string) {
    return cardHolderName === customerName;
}
export function validateCardNumber(cardNumber: string) {
    cardNumber = cardNumber.replace(/[-\s]/g, '');
    return cardNumber.length === 16;
}
export function isCompletedPayment(paymentStatus: PaymentStatus) {
    return paymentStatus === PaymentStatus.completed;
}
