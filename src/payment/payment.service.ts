import { BadRequestException, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaymentDto } from 'src/payment/dto/payment.dto';
import { TypedBody } from '@nestia/core';

@Injectable()
export class PaymentService {

  
 
  sendPaymentRequestToPG(paymentInfo : PaymentDto, customerName:string){
    if(!this.validatePaymentInfo(paymentInfo, customerName)) throw new BadRequestException()
    if(paymentInfo.cardNumber == '1111-1111-1111-1111')
    throw new BadRequestException()
    return HttpStatus.ACCEPTED;
  }
  validatePaymentInfo(paymentInfo : PaymentDto, customerName : string){
    return this._validCardHolder(paymentInfo.cardHolderName, customerName) 
            && this._validateCardNumber(paymentInfo.cardNumber);
  }
  _validCardHolder(cardHolderName : string, customerName : string){
    return cardHolderName == customerName
  }
  _validateCardNumber(cardNumber:string){
    cardNumber = cardNumber.replace(/[-\s]/g, '');
    return cardNumber.length == 16;
  }



}
