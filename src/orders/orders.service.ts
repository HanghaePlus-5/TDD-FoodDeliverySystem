import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { Prisma, Order} from '@prisma/client';


@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}
    
    async createOrder( order: Prisma.OrderUncheckedCreateInput
    ){
        this.isUserTypeCustomer(order.userId);
        this.isOrderItemCountInRange(order.orderItem);

        if (order.orderItem) {
            if (Array.isArray(order.orderItem)) {
              for (const orderItem of order.orderItem) {
                this.isValidMenu(orderItem);
              }
            } else {
              this.isValidMenu(order.orderItem);
            }
          } else {
            new Error()
          }

        this.isValidStore(order.storeId);
        this.hasEnoughStock(order.orderItem);
        this.hasOngoingOrder(order.userId);
        const savedOrder = await this.saveOrder(order);
        const orderId = savedOrder.orderId;
        const savedOrderItem = await this.saveOrderItem(order.orderItem);
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
    hasEnoughStock(orderItem: Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput | undefined) {
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