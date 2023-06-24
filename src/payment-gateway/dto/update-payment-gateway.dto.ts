import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentGatewayDto } from './create-payment-gateway.dto';

export class UpdatePaymentGatewayDto extends PartialType(CreatePaymentGatewayDto) {}
