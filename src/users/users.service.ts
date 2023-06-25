import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PrismaService } from 'src/prisma';
import { bcryptHash } from 'src/lib/bcrypt';

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
    if (!email || typeof password !== 'string') return null;
    
    const where = {
      email,
      password: await bcryptHash(password),
    }
    return this.prisma.user.findFirst({ where });
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
