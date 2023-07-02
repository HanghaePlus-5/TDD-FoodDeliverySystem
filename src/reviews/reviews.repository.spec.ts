import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from 'src/prisma';


describe('ReviewRepository', () => {
  let repo: ReviewsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsRepository,
        PrismaService,
      ],
    }).compile();

    repo = module.get<ReviewsRepository>(ReviewsRepository);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });
});
