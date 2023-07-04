export const OrderStatus = {
    PAYMENT_PROCESSING: 'PAYMENT_PROCESSING',
    PAYMENT_FAIL: 'PAYMENT_FAIL',
    ORDER_RECEIVED: 'ORDER_RECEIVED',
    ORDER_CONFIRMED: 'ORDER_CONFIRMED',
    DELIVERY_STARTED: 'DELIVERY_STARTED',
    DELIVERED: 'DELIVERED',
    CANCEL_REQUESTED: 'CANCEL_REQUESTED',
    CANCELED: 'CANCELED',
  } as const;

declare global {
    type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
    interface Order {
        orderId: number;
        userId: number;
        storeId: number;
        createdAt: Date;
        updatedAt:Date;
        status: OrderStatus;
    }
}
