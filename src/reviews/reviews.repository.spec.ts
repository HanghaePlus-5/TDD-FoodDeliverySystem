import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from 'src/prisma';


describe('ReviewRepository', () => {
  let repo: ReviewsRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsRepository,
        PrismaService,
      ],
    }).compile();

    repo = module.get<ReviewsRepository>(ReviewsRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.review.deleteMany();
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it.todo('should throw error if user already reviewd the order.');

    it.todo('should throw error if db fails to create review.');

    it.todo('should return the created review if success.');
  });
});
