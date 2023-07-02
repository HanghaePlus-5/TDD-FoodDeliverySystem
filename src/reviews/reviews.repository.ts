import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';

@Injectable()
export class ReviewsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
}