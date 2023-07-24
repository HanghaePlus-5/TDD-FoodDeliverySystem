import {
 BadRequestException, Controller, Get, Req, UnauthorizedException,
} from '@nestjs/common';
import { TypedBody, TypedRoute } from '@nestia/core';
import { is } from 'typia';

import { UserTypes } from 'src/auth/decorators';

import { OrderCreateDto } from './dto/order-create.dto';
import { OrdersService } from './orders.service';

import { UserType } from 'src/types';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) {}

    @Get()
    findAll(): string {
        return 'hello';
    }

    @UserTypes(UserType.CUSTOMER)
    @TypedRoute.Post('/')
    async create(
        @Req() req: Express.Request,
        @TypedBody() body: OrderCreateDto,
    ) {
        const { payload } = req;
        if (!is<UserPayload>(payload)) {
            throw new UnauthorizedException();
        }

        return this.ordersService.createOrder(body, payload);
    }
}
