import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutsService } from './checkouts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Checkout } from './entities/checkout.entity';

describe('CheckoutsService', () => {
  let service: CheckoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutsService,
        { provide: getRepositoryToken(Checkout), useValue: {} },
      ],
    }).compile();

    service = module.get<CheckoutsService>(CheckoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});