import { HttpStatus, Injectable } from '@nestjs/common';
import { PaymentCreateDto } from 'src/payment/dto/payment-create.dto';
import { PaymentGatewayResponseDto } from 'src/lib/payment-gateway/dto/payment-gateway-response.dto';

@Injectable()
export class PaymentGatewayService {
    async sendPaymentRequestToPG(paymentInfo: PaymentCreateDto): Promise<PaymentGatewayResponseDto> {
        // mocking fail case
        if (paymentInfo.cardNumber === '1111-1111-1111-1111') {
          return {
            status: HttpStatus.BAD_REQUEST,
            data: {
              paymentGatewayId: "1",
              message: "fail"
            }
          }
        }
        return {
          status: HttpStatus.ACCEPTED,
          data: {
            paymentGatewayId: "1",
            message: "success"
          }
        }
      }

      sendCancelRequestToPG() {

      }
}
