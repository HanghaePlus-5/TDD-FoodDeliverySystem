import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '@prisma/client';

import { PrismaService } from 'src/prisma';
import { OrderStatus } from 'src/types/orders';

@Injectable()
export class DeliveryService {
    constructor(private readonly prisma: PrismaService) { }

    async startDelivery(orderId: number) {
        const order = await this.prisma.order.findUnique({ where: { orderId } });
        if (!order) { throw new NotFoundException('order does not exist'); }
        if (!this.isOrderStatusConfirmed(order)) {
            throw new BadRequestException('this order is not confirmed');
        }
    }

    // async checkDeliveryTime(orderId: number) {}

    private isOrderStatusConfirmed(order : Order) {
        return order.status === OrderStatus.ORDER_CONFIRMED;
    }
}
