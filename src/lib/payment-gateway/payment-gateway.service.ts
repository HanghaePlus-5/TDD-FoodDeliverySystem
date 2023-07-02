import {
 BadRequestException, HttpStatus, Injectable, NotAcceptableException,
} from '@nestjs/common';

import { PaymentGatewayResponseDto } from 'src/lib/payment-gateway/dto/payment-gateway-response.dto';
import { PaymentCreateDto } from 'src/payment/dto/payment-create.dto';

@Injectable()
export class PaymentGatewayService {
    async sendPaymentRequestToPG(paymentInfo: PaymentCreateDto): Promise<PaymentGatewayResponseDto> {
        // mocking fail case
        if (paymentInfo.cardNumber === '1111-1111-1111-1111') {
          throw new NotAcceptableException('failed due to some reason');
        }
        return {
          status: HttpStatus.ACCEPTED,
          data: {
            paymentGatewayId: '1',
            status: 'payment success',
          },
        };
      }

    async sendCancelRequestToPG(paymentGatewayId : string): Promise<PaymentGatewayResponseDto> {
        // mocking fail case
        if (paymentGatewayId === '123456') {
          throw new NotAcceptableException('not cancelable paymentGatewayId');
        }
        return {
          status: HttpStatus.ACCEPTED,
          data: {
            paymentGatewayId: '2',
            status: 'cancel success',
          },
        };
      }
}
