import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>
  ) {}
  create(createExpenseDto: CreateExpenseDto) {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      cashShift: { id: createExpenseDto.cashShiftId },
      user: { id: createExpenseDto.usuarioId } 
    });
    return this.expenseRepository.save(expense);
  }

  findAll() {
    return this.expenseRepository.find()
  }

  findOne(id: number) {
    return this.expenseRepository.findOneBy({ id });
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseRepository.update(id, updateExpenseDto);
  }

  remove(id: number) {
    return this.expenseRepository.delete(id);
  }
}
