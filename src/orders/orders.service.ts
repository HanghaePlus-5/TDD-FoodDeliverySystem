import { Injectable } from '@nestjs/common';

import { CustomOrder } from './orders.entity';

@Injectable()
export class OrdersService {
    Orders: CustomOrder[];

    constructor() {
        this.Orders = [];
    }

    addOrder(order:CustomOrder) {
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
    
}
