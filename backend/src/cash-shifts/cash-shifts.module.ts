import { Module } from '@nestjs/common';
import { CashShiftsService } from './cash-shifts.service';
import { CashShiftsController } from './cash-shifts.controller';
import { Order } from 'src/orders/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashShift } from './entities/cash-shift.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { User } from 'src/users/entities/user.entity';
import { Checkout } from 'src/checkouts/entities/checkout.entity';

@Module({
  controllers: [CashShiftsController],
  providers: [CashShiftsService],
  imports: [
    TypeOrmModule.forFeature([
      CashShift,
      Expense,
      User,
      Checkout,
      Order
    ])
  ]
})
export class CashShiftsModule {}
