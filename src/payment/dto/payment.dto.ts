import { type } from 'os';

export interface PaymentDto {
    /**
     * Payment PK
     * @type int
    */
    paymentId: number;

    /**
     * CardNumber
     * @pattern ^(\\d{4}-){3}\\d{4}$|^(\\d{4} ){3}\\d{4}$|^\\d{16}$
     */
    cardNumber: string;

    /**
     * CardExpiryMonth
     * @type int
     * @minimum 1
     * @maximum 12
     */
    cardExpiryMonth: number;

    /**
     * @type int
     * @minimum 2023
     */
    cardExpiryYear: number;

    /**
     * CardHolderName
     */
    cardHolderName: string;

    /**
     * CardIssuer
     */
    cardIssuer: string;
}
