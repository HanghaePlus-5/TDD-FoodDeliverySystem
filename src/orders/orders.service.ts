import { Injectable } from '@nestjs/common';
import {
 Prisma, Order, OrderItem, UserType, OrderStatus,
} from '@prisma/client';

import { PrismaService } from 'src/prisma';

import { OrderCreateDto } from './dto/order-create.dto';
import { OrderItemCreateDto, OrderItemCreatePrismaDto } from './dto/orderItem-create.dto';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createOrder(orderCreateDto: OrderCreateDto) {
        this.isUserTypeCustomer(orderCreateDto.user.userId);
        this.isOrderItemCountInRange(orderCreateDto.orderItem);
        const orderItemList : OrderItemCreatePrismaDto[] = [];
        const orderTotalPrice = 0;

        if (orderCreateDto.orderItem) {
            orderCreateDto.orderItem.forEach((orderItem) => {
              this.isValidMenu(orderItem.menuId);
              this.hasEnoughStock(orderItem);
            });
          } else {
            throw new Error('Order items not provided');
          }

        this.isValidStore(orderCreateDto.storeId);
        this.hasOngoingOrder(orderCreateDto.user.userId);
        const order = {
            userId: orderCreateDto.user.userId,
            storeId: orderCreateDto.storeId,
        };
        const savedOrder = await this.saveOrder(order);
        const { orderId } = savedOrder;

        orderCreateDto.orderItem.forEach((orderItem) => {
            const orderItemData: OrderItemCreatePrismaDto = {
              orderId,
              menuId: orderItem.menuId,
              quantity: orderItem.quantity,
            };
            orderItemList.push(orderItemData);
          });

        const savedOrderItem = await this.saveOrderItemList(orderItemList);
        const processedOrder = { ...savedOrder, orderId } as Order;
        this.processPayment(processedOrder);
        this.alarmStoreInitially(processedOrder);

        // 주문번호, 주문상태
        const result = processedOrder;
        return processedOrder;
    }
    async isValidMenu(menuId: number) {
        const menu = await this.prisma.menu.findUnique({
            where: {
                menuId,
            },
        });
        return menu !== null;
    }
    async isValidStore(storeId: number) {
            const store = await this.prisma.store.findUniqueOrThrow({
                where: {
                    storeId,
                    },
            });
        return true;
    }

    alarmStoreInitially(processedOrder: Order) {
        return true;
    }
    async hasOngoingOrder(userId: number) {
        const validStatuses = ['PAYMENT_PROCESSING',
         'ORDER_RECEIVED',
         'ORDER_CONFIRMED',
         'DELIVERY_STARTED',
         'CANCEL_REQUESTED'];

        const result = await this.prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: ['PAYMENT_PROCESSING',
                    'ORDER_RECEIVED',
                    'ORDER_CONFIRMED',
                    'DELIVERY_STARTED',
                    'CANCEL_REQUESTED'],
                },
            },
        });
        return result.length > 0;
    }
    hasEnoughStock(orderItem: OrderItemCreateDto) {
        return true;
    }
    isOrderItemCountInRange(orderItem: OrderItemCreateDto[]) {
        return orderItem.length > 0 && orderItem.length <= 10;
    }
    saveOrder(data: Prisma.OrderUncheckedCreateInput): Prisma.Prisma__OrderClient<Order, never> {
            return this.prisma.order.create({ data });
        }
    saveOrderItemList(data: OrderItemCreatePrismaDto[]) {
        return this.prisma.orderItem.createMany({ data });
    }
    processPayment(order: Order) {
        try {
            this.callPaymentMethod(order);
        } catch (error) {
            throw new Error();
        }
        return 'callPaymentMethod has been called';
    }

    isUserTypeCustomer(userId: number): boolean {
        if (this.verifyType(userId) === 'BUSINESS') {
            return false;
        }
        return true;
    }

    verifyType(userId: number): string {
        try {
            // User type will be verified using payload
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error();
            }
        }
        return 'CUSTOMER';
    }

    callPaymentMethod(order: Order) {
        return true;
    }
}
