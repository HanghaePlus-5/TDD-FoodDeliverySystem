import { OrderDto } from './order.dto';

export type OrderCreateDto = Pick<OrderDto, 'storeId'|'orderItem'>
