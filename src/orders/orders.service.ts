import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { Prisma, Order} from '@prisma/client';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderItemCreateDto } from './dto/orderItem-create.dto';


@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}
    
    async createOrder( orderCreateDto: OrderCreateDto
    ){
        this.isUserTypeCustomer(orderCreateDto.user.userId);
        this.isOrderItemCountInRange(orderCreateDto.orderItem);

        if (orderCreateDto.orderItem) {
            if (Array.isArray(orderCreateDto.orderItem)) {
              for (const orderItem of orderCreateDto.orderItem) {
                this.isValidMenu(orderItem);
                this.hasEnoughStock(orderItem);
              }
            } else {
              this.isValidMenu(orderCreateDto.orderItem);
              this.hasEnoughStock(orderItem);
            }
          } else {
            new Error()
          }

        this.isValidStore(orderCreateDto.storeId);
        this.hasOngoingOrder(orderCreateDto.user.userId);
        const savedOrder = await this.saveOrder(orderCreateDto);
        const orderId = savedOrder.orderId;
        const savedOrderItem = await this.saveOrderItem(orderCreateDto.orderItem);
        const processedOrder = { ...savedOrder, orderId } as Order;
        this.processPayment(processedOrder);
        this.alarmStoreInitially(processedOrder);
        // 주문번호, 주문상태 ,  
        const result = processedOrder
        return result
    }
    isValidMenu(orderItem: any) {
        throw new Error('Method not implemented.');
    }
    isValidStore(storeId: number) {
        throw new Error('Method not implemented.');
    }
    saveOrderItem(orderItem: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput | undefined) {
        throw new Error('Method not implemented.');
    }
    alarmStoreInitially(processedOrder: Order) {
        throw new Error('Method not implemented.');
    }
    hasOngoingOrder(userId: number) {
        throw new Error('Method not implemented.');
    }
    hasEnoughStock(orderItem: OrderItemCreateDto) {
        throw new Error('Method not implemented.');
    }
    isOrderItemCountInRange(orderItem: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput[] | Prisma.OrderItemCreateManyInput[] | Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput | undefined | Prisma.OrderItemCreateManyInput[]) {
        throw new Error('Method not implemented.');
    }
    saveOrder( data: Prisma.OrderUncheckedCreateInput): Prisma.Prisma__OrderClient<Order, never>
        {
            return this.prisma.order.create({data});
        }

    processPayment(order: Order) {
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
    
    
}

    // addOrder(order:CustomOrder, user: User): number {
    //     if (!this.isUserTypeCustomer(user)) {
    //         throw new Error('Only customers are allowed to add orders.');
    //       }
    //     if(this.userHasOngoingOrder(user)){
    //         throw new Error('User already has an ongoing order.');
    //     }
    //     this.processPayment(order);
    //     this.Orders.push(order);
        
    //     return order.id
    // }
    
    // userHasOngoingOrder(user: User): boolean {
    //     return this.Orders.some(order => order.userId === user.userId);
    // }