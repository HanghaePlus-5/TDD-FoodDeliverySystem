import { Injectable } from '@nestjs/common';

import { CustomOrder } from './orders.entity';

@Injectable()
export class OrdersService {
    Orders: CustomOrder[];

    constructor() {
        this.Orders = [];
    }

    addOrder(order:CustomOrder, user: User): number {
        if (!this.isUserTypeCustomer(user)) {
            throw new Error('Only customers are allowed to add orders.');
          }
        if(this.userHasOngoingOrder(user)){
            throw new Error('User already has an ongoing order.');
        }
        this.processPayment(order);
        this.Orders.push(order);
        
        return order.id
    }
    
    processPayment(order:CustomOrder) {
    }

    isUserTypeCustomer(user: User): boolean {
        if (user.type === "BUSINESS"){
            return false;
        }
        return true;
    }
    userHasOngoingOrder(user: User): boolean {
        return this.Orders.some(order => order.userId === user.userId);
    }
    
}
