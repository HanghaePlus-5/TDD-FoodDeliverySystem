import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UserType } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  isUserType(userType: string|undefined): userType is UserType {
    return Object.values(UserType).includes(userType as UserType);
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
