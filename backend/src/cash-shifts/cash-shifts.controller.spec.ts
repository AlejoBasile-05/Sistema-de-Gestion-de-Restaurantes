import { Test, TestingModule } from '@nestjs/testing';
import { CashShiftsController } from './cash-shifts.controller';
import { CashShiftsService } from './cash-shifts.service';

describe('CashShiftsController', () => {
  let controller: CashShiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashShiftsController],
      providers: [{ provide: CashShiftsService, useValue: {} }],
    }).compile();

    controller = module.get<CashShiftsController>(CashShiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});