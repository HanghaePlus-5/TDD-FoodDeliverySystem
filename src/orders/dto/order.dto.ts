import { OrderItemCreateDto } from "./orderItem-create.dto";

export interface OrderDto {
    
    user: User;
    storeId: number;
    oderItem: OrderItemCreateDto[];
    
    orderId: number;
    createdAt: Date;
    updatedAt: Date;
    status: OrderStatus;
  }
  