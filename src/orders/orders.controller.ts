import { Controller, Get } from '@nestjs/common';
import { IgnoreAuth } from 'src/auth/decorators';

@IgnoreAuth()
@Controller('orders')
export class OrdersController {
    @Get()
    findAll(): string {
        return 'hello';
    }
}
