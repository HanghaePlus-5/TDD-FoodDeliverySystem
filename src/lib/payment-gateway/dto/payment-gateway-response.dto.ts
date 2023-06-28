import { HttpStatus } from "@nestjs/common"

export interface PaymentGatewayResponseDto {
    status : HttpStatus
    data : PaymentGatewayData
}
export interface PaymentGatewayData {
    paymentGatewayId : string
    status : string
}