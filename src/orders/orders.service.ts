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

    // TODO: saveOrder, saveOrderItemList, processPayment 트랜잭션 구성
    async createOrder(orderCreateDto: OrderCreateDto, { userId }: UserPayload) {
        const hasOngoingOrder = await this.hasOngoingOrder(userId);
        if (hasOngoingOrder) {
            throw new BadRequestException('Ongoing order exists');
        }

        const isOrderValid = await this.checkOrderItems(orderCreateDto.orderItem);
        if (!isOrderValid) {
            throw new BadRequestException('Invalid order items');
        }

        // 요건 findUniqueOrThrow로 DB에서 error throw 하시길래 그대로 살림
        await this.isValidStore(orderCreateDto.storeId);

        const order = {
            userId,
            storeId: orderCreateDto.storeId,
        };
        const savedOrder = await this.saveOrder(order);
        const { orderId } = savedOrder;

        // const orderTotalPrice = 0;
        const orderItemList = orderCreateDto.orderItem.map((orderItem) => ({
            orderId,
            menuId: orderItem.menuId,
            quantity: orderItem.quantity,
        }));

        const savedOrderItem = await this.saveOrderItemList(orderItemList);
        // 가능하면 as 키워드는 지양하는 것이 좋음
        // as: 컴파일러가 추론할 수 없는 타입을 개발자가 확정할 때 사용
        // const processedOrder = { ...savedOrder, orderId } as Order;
        const processedOrder: Order = { ...savedOrder, orderId };

        this.processPayment(processedOrder);
        this.alarmStoreInitially(processedOrder);

        // 주문번호, 주문상태
        return processedOrder;
    }

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

    async isValidMenu(menuId: number) {
        const menu = await this.prisma.menu.findUnique({
            where: {
                menuId,
            },
        });
        return menu !== null;
    }
    async isValidStore(storeId: number) {
        await this.prisma.store.findUniqueOrThrow({
            where: {
                storeId,
                },
        });
    }

    alarmStoreInitially(processedOrder: Order) {
        return true;
    }
    async hasOngoingOrder(userId: number) {
        const validStatuses = [
            OrderStatus.PAYMENT_PROCESSING,
            OrderStatus.ORDER_RECEIVED,
            OrderStatus.ORDER_CONFIRMED,
            OrderStatus.DELIVERY_STARTED,
            OrderStatus.CANCEL_REQUESTED,
        ];

        const result = await this.prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: validStatuses,
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
