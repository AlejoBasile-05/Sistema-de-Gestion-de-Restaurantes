import { Test, TestingModule } from '@nestjs/testing';
import { CashShiftsService } from './cash-shifts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CashShift } from './entities/cash-shift.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Checkout } from 'src/checkouts/entities/checkout.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { DataSource } from 'typeorm';

describe('CashShiftsService', () => {
  let service: CashShiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashShiftsService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(CashShift), useValue: {} },
        { provide: getRepositoryToken(Order), useValue: {} },
        { provide: getRepositoryToken(Checkout), useValue: {} },
        { provide: getRepositoryToken(Expense), useValue: {} },
      ],
    }).compile();

    service = module.get<CashShiftsService>(CashShiftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});