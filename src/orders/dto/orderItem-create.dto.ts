import { OrderItemDto } from './orderItem.dto';

export type OrderItemCreateDto = Pick<OrderItemDto, 'quantity'|'menuId'>
export type OrderItemCreatePrismaDto = Pick<OrderItemDto, 'orderId'|'quantity'|'menuId'>
