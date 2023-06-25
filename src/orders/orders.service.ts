import { Injectable } from '@nestjs/common';
import { CustomOrder } from './orders.entity';

@Injectable()
export class OrdersService {

    Orders: CustomOrder[];

    constructor(){
        this.Orders = [];
    }

    addOrder(order:CustomOrder){
        this.Orders.push(order);
    }
}
