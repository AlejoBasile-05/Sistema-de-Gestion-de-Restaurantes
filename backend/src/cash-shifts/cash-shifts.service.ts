import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenBoxDto } from './dto/create-cash-shift.dto';
import { CloseBoxDto } from './dto/update-cash-shift.dto';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Order } from 'src/orders/entities/order.entity';
import { Repository } from 'typeorm/repository/Repository';
import { DataSource } from 'typeorm/data-source/DataSource';
import { CashShift } from './entities/cash-shift.entity';
import { MetodoDePago } from 'src/orders/dto/orders.dto';
import { Between, IntegerType, IsNull, LessThanOrEqual, Not } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Checkout } from 'src/checkouts/entities/checkout.entity';
import { Expense, ExpenseType } from 'src/expenses/entities/expense.entity';
import { AnyARecord } from 'node:dns';

@Injectable()
export class CashShiftsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(CashShift) private readonly cashShiftsRepository: Repository<CashShift>,
    @InjectRepository(Checkout) private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Expense) private readonly expenseRepository: Repository<Expense>
  ) {}

  async openBox(data: OpenBoxDto) {
    const dateNow = new Date();
    const checkoutEntity = await this.checkoutRepository.findOne({
      where: { numeroDeCaja: data.cashRegisterNumber }
    });

    if (!checkoutEntity) {
        throw new NotFoundException(`La caja número ${data.cashRegisterNumber} no existe.`);
    }

    const activeShift = await this.cashShiftsRepository.findOne({
      where: { 
        dateClosing: IsNull(), 
        checkout: { numeroDeCaja: data.cashRegisterNumber } 
      }
    });

    if (activeShift) {
      throw new BadRequestException('Ya existe una caja abierta para este punto de venta.');
    }

    const newCashShift = this.cashShiftsRepository.create({
      checkout: checkoutEntity,
      openingAmount: data.openingAmount,
      dateOpening: dateNow,
    });

    const savedShift = await this.cashShiftsRepository.save(newCashShift);

    const lastShift = await this.cashShiftsRepository.findOne({
      where: { 
        checkout: { numeroDeCaja: data.cashRegisterNumber },
        dateClosing: Not(IsNull()) 
      },
      order: { dateClosing: 'DESC' } 
    });

    const lastClosingDate = lastShift ? lastShift.dateClosing : new Date('1970-01-01');

    await this.orderRepository.createQueryBuilder()
      .update(Order)
      .set({ cashShiftId: savedShift.id }) 
      .where("createdAt <= :dateOpening", { dateOpening: savedShift.dateOpening })
      .andWhere("cashShiftId IS NULL") 
      .execute();

    return savedShift;
  }

  async closeBox(data: CloseBoxDto) {
    const today = new Date()
    const currentShift = await this.cashShiftsRepository.findOne({
      where: {dateClosing: IsNull(), checkout: { numeroDeCaja: data.cashRegisterNumber }},
    })

    if (!currentShift) {
        throw new NotFoundException('No hay ninguna caja abierta para cerrar.');
    }

    await this.orderRepository.createQueryBuilder()
        .update(Order)
        .set({ cashShift: currentShift })
        .where("createdAt >= :start", { start: currentShift.dateOpening })
        .andWhere("createdAt <= :end", { end: today })
        .andWhere("cashShiftId IS NULL")
        .execute();

    const virtualAmount = await this.orderRepository.createQueryBuilder('order')
      .where("order.cashShift.id = :id", { id: currentShift.id })
      .andWhere("order.status = :status", { status: "PAGADO" })
      .andWhere("order.paymentMethod = :paymentMethod", { paymentMethod: MetodoDePago.TARJETA })
      .select("SUM(order.total)", 'total')
      .getRawOne()

    const physicalAmount = await this.orderRepository.createQueryBuilder('order')
      .where("order.cashShift.id = :id", { id: currentShift.id })
      .andWhere("order.status = :status", { status: "PAGADO" })
      .andWhere("order.paymentMethod = :paymentMethod", { paymentMethod: MetodoDePago.EFECTIVO || IsNull() })
      .select("SUM(order.total)", 'total')
      .getRawOne()

    const pyshicalExpenses = await this.expenseRepository.createQueryBuilder('expense')
      .where("expense.cashShift.id = :id", { id: currentShift.id })
      .andWhere("expense.type = :type", { type: ExpenseType.EFECTIVO })
      .select("SUM(expense.amount)", 'total')
      .getRawOne()

    const virtualExpenses = await this.expenseRepository.createQueryBuilder('expense')
      .where("expense.cashShift.id = :id", { id: currentShift.id })
      .andWhere("expense.type = :type", { type: ExpenseType.TARJETA })
      .select("SUM(expense.amount)", 'total')
      .getRawOne()

    const systemCash = Number(physicalAmount?.total || 0)
    const systemVirtual = Number(virtualAmount?.total || 0)

    const differenceVirtual = Number(data.closedVirtualAmount) - systemVirtual + Number((virtualExpenses?.total || 0))
    const differenceCash = Number(data.closedCashAmount) - systemCash - Number(currentShift?.openingAmount || 0) + Number((pyshicalExpenses?.total || 0))

    const totalDifference = Number(differenceVirtual) + Number(differenceCash)

    const totalExpenses = Number(pyshicalExpenses?.total || 0) + Number(virtualExpenses?.total || 0)

    await this.cashShiftsRepository.update(
      { id: currentShift.id },
      {
        closedVirtualAmount: data.closedVirtualAmount,
        closedCashAmount: data.closedCashAmount,
        dateClosing: today,
        difference: totalDifference,
        systemCashAmount: systemCash,
        systemVirtualAmount: systemVirtual,
        totalExpenses: totalExpenses
      }
    );

    const status = {
            status: totalDifference === 0 ? 'Exitoso' : 'Con Diferencias',
            difference: totalDifference,
            details: {
                cashDifference: differenceCash,
                virtualDifference: differenceVirtual 
            }
        };

    return status;
  }

  findAll() {
    return this.cashShiftsRepository.find();
  }

  findOne(numeroDeCaja: number) {
    return this.cashShiftsRepository.findOneBy({ checkout: {id : numeroDeCaja } });
  }

  findByDate(date: Date) {
    return this.cashShiftsRepository.findOne({
      where: { dateOpening: date }
    });
  }

  update(id: number, updateCashShiftDto: CloseBoxDto) {
    return this.cashShiftsRepository.update(id, updateCashShiftDto);
  }

  async remove(id: number) {

    await this.orderRepository.update(
      { cashShift: { id: id } },
      { cashShift: null } 
    );

    await this.expenseRepository.update(
      { cashShift: { id: id } },
      { cashShift: null } 
    );

    const result = await this.cashShiftsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`La caja con ID ${id} no existe.`);
    }

    return { message: `Caja ${id} eliminada correctamente y sus órdenes/gastos fueron liberados.` };
  }
}
