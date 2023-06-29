import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';
import { Prisma, Order, OrderItem} from '@prisma/client';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderItemCreateDto, OrderItemCreatePrismaDto } from './dto/orderItem-create.dto';



@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createOrder( orderCreateDto: OrderCreateDto
    ){
        this.isUserTypeCustomer(orderCreateDto.user.userId);
        this.isOrderItemCountInRange(orderCreateDto.orderItem);
        const orderItemList : OrderItemCreatePrismaDto[] = [];
        let orderTotalPrice: number = 0


        if (orderCreateDto.orderItem) {
            for (const orderItem of orderCreateDto.orderItem) {
            this.isValidMenu(orderItem);
            this.hasEnoughStock(orderItem);
            

            }
        } else {
            new Error()
        }


        this.isValidStore(orderCreateDto.storeId);
        this.hasOngoingOrder(orderCreateDto.user.userId);
        const order = {
            userId:orderCreateDto.user.userId,
            storeId:orderCreateDto.storeId
        }
        const savedOrder = await this.saveOrder(order);
        const orderId = savedOrder.orderId;
       
        
        for (const orderItem of orderCreateDto.orderItem) {
            const orderItemData : OrderItemCreatePrismaDto = {
                orderId,
                menuId:orderItem.menuId,
                quantity: orderItem.quantity
            } 
            orderItemList.push(orderItemData);
            }

        const savedOrderItem = await this.saveOrderItemList(orderItemList);
        const processedOrder = { ...savedOrder, orderId } as Order;
        this.processPayment(processedOrder);
        this.alarmStoreInitially(processedOrder);

        // 주문번호, 주문상태  
        const result = processedOrder
        return result
    }
    isValidMenu(orderItem: any) {
        return 0;
    }
    async isValidStore(storeId: number) {
            const store = await this.prisma.store.findUniqueOrThrow({
                where: {
                    storeId: storeId,
                    },
            })
        return true;
    }

    alarmStoreInitially(processedOrder: Order) {
        return 0;;
    }
    hasOngoingOrder(userId: number) {
        return 0;;
    }
    hasEnoughStock(orderItem: OrderItemCreateDto) {
        return 0;;
    }
    isOrderItemCountInRange(orderItem: OrderItemCreateDto[]) {
        return 0;;
    }
    saveOrder( data: Prisma.OrderUncheckedCreateInput): Prisma.Prisma__OrderClient<Order, never>
        {
            return this.prisma.order.create({data});
        }
    saveOrderItemList(data: OrderItemCreatePrismaDto[]) {
        return this.prisma.orderItem.createMany({data})
    }
    processPayment(order: Order) {
        try {
            this.callPaymentMethod(order)
        } catch (error) {
            throw new Error();
        }
        return "callPaymentMethod has been called";
    }

    isUserTypeCustomer(userId: number): boolean {
        if (this.verifyType(userId) === "BUSINESS"){
            return false;
        }
        return true;
    }

    verifyType(userId: number): string {
        try {
            //User type will be verified using payload
        } catch (error) {
            throw new Error(error);
        }
        return "CUSTOMER"

    }
    
    callPaymentMethod(order: Order) {    
    }
    
}



