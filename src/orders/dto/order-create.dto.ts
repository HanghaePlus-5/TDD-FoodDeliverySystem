import { OrderDto } from "./order.dto";

export type OrderCreateDto = Pick<OrderDto, 'user'|'storeId'|'orderItem'>
