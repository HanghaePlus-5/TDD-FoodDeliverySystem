import { TypedBody, TypedRoute } from '@nestia/core';
import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrdersService } from './orders.service';
import { UserTypes } from 'src/auth/decorators';
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
        if (req.payload.userId !== body.user.userId) {
            throw new BadRequestException();
        }

        return this.ordersService.createOrder(body);
    }
}
