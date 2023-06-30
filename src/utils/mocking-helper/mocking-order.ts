import { OrderDto } from "src/orders/dto/order.dto";
import { OrderStatus } from "src/types/orders";

export function mockingOrderDto (dto? : Partial<OrderDto>): OrderDto {
    return {
        orderId: 1,
        user: {
            userId: 12345,
            email: "john@example.com",
            name: "michael",
            password: "password123",
            type: "CUSTOMER",
        },
        status: OrderStatus.CANCELED,
        createdAt: new Date(),
        updatedAt: new Date(),
        storeId: 67890,
        orderItem: [
            {
                quantity: 2,
                menuId: 101,
            },
            {
                quantity: 1,
                menuId: 102,
            },
        ],
    ...dto
    }
};