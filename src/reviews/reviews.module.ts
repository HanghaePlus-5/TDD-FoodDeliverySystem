import { Module } from '@nestjs/common';

import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from 'src/prisma';

@Module({
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    ReviewsRepository,
    PrismaService,
  ]
})
export class ReviewsModule {}
