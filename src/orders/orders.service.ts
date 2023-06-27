import { Injectable } from '@nestjs/common';

// import { CustomOrder } from './orders.entity';
import { PrismaService } from 'src/prisma';
import { Prisma} from '@prisma/client';


@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}
    
    async createOrder( order: Prisma.OrderCreateInput
    ){
        const data = order
        console.log("createOrder", order)
        return await this.prisma.order.create({data});
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
    
    // processPayment(order:CustomOrder) {
    // }

    isUserTypeCustomer(user: User): boolean {
        if (user.type === "BUSINESS"){
            return false;
        }
        return true;
    }
    // userHasOngoingOrder(user: User): boolean {
    //     return this.Orders.some(order => order.userId === user.userId);
    // }
    
}
