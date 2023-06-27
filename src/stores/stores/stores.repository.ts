import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {}
}
