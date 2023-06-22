import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { UserType } from 'src/types';
Prisma

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  isUserType(userType: string|undefined): userType is UserType {
    return Object.values(UserType).includes(userType as UserType);
  }

  async findUserByEmail(
    where: Prisma.UserWhereUniqueInput
  ): Promise<User|null> {
    return this.prisma.user.findUnique({ where });
  }
}