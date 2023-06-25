import { Module } from '@nestjs/common';

import { UserTypeGuard } from './guards/user-type.guard';

@Module({
    providers: [UserTypeGuard],
    exports: [UserTypeGuard],
    })
export class AuthModule {}
