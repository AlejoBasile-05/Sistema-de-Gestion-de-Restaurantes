import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: getRepositoryToken(Expense), useValue: {} },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});