export interface PaymentDto {
    /**
     * @pattern ^(\d{4}-){3}\d{4}$|^(\d{4} ){3}\d{4}$|^\d{16}$
     */
    cardNumber: string;
    cardExpiryMonth: number;
    cardExpiryYear: number;
    cardHolderName: string;
    cardIssuer: string;
}