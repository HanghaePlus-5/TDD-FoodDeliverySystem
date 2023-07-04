import { OrderItemCreateDto } from './orderItem-create.dto';

export interface OrderDto {

    user: User;
    storeId: number;
    orderItem: OrderItemCreateDto[];

    orderId: number;
    createdAt: Date;
    updatedAt: Date;
    status: OrderStatus;
  }
