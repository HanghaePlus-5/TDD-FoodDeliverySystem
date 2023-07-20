import { BadRequestException, Injectable } from '@nestjs/common';
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

    async checkOrderItems(orderItems: OrderItemCreateDto[]) {
        // 주문 아이템이 1개 이상 10개 이하인지 확인
        if (!(orderItems.length > 0 && orderItems.length <= 10)) {
            return false;
        }

        // 주문 아이템이 모두 유효한지 확인
        const promises = orderItems.map((orderItem) => this.isValidMenu(orderItem.menuId));
        const results = await Promise.all(promises);
        if (results.some((result) => result === false)) {
            return false;
        }

        return true;
    }

    async createOrder(orderCreateDto: OrderCreateDto) {
        const isValidOrder = await this.checkOrderItems(orderCreateDto.orderItem);
        if (!isValidOrder) {
            throw new BadRequestException();
        }
        const orderItemList : OrderItemCreatePrismaDto[] = [];
        const orderTotalPrice = 0;

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

    callPaymentMethod(order: Order) {
        return true;
    }
}
