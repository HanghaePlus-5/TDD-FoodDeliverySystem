import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from 'src/prisma';
import { bcryptCompare, bcryptHash } from 'src/lib/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findUserByEmail(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User|null> {
    return this.prisma.user.findUnique({ where });
  }

  async findUserByEmailAndPassword(
    { email, password }: Prisma.UserWhereInput,
  ) {
    if (typeof email !== 'string' || typeof password !== 'string') {
      return null;
    }

    const where: Prisma.UserWhereUniqueInput = { email };
    const user = await this.prisma.user.findUnique({ where });
    if (user === null) {
      return null;
    }

    const isPasswordEqual = await bcryptCompare(password, user.password);
    return isPasswordEqual ? user : null;
  }

  async createUser(
    form: Prisma.UserCreateInput,
  ) {
    const data = {
      ...form,
      password: await bcryptHash(form.password),
    };
    return this.prisma.user.create({ data });
  }
}
