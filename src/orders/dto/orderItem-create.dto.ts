import { OrderItemDto } from "./orderItem.dto";

export type OrderItemCreateDto = Pick<OrderItemDto, 'orderId'|'quantity'|'menuId'>