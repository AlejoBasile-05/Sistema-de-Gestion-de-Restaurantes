import { CashShift } from "src/cash-shifts/entities/cash-shift.entity";
import { User } from "src/users/entities/user.entity";
import { Column, ColumnTypeUndefinedError, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ExpenseType {
    EFECTIVO = "EFECTIVO",
    TARJETA = "TARJETA"
}

@Entity()
export class Expense {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.expenses)
    user: User;
    
    @ManyToOne(() => CashShift, (cashShift) => cashShift.expenses)
    cashShift: CashShift | null;

    @Column({ type: 'enum', enum: ExpenseType })
    type: ExpenseType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column()
    description: string

    @CreateDateColumn()
    date: Date
}
