import { Checkout } from "src/checkouts/entities/checkout.entity";
import { Expense } from "src/expenses/entities/expense.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/users/entities/user.entity";
import { Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Entity } from "typeorm";

@Entity()
export class CashShift {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamptz', nullable: true})
    dateOpening: Date;

    @Column({type: 'timestamptz', nullable: true})
    dateClosing: Date;

    @ManyToOne(() => User, (user) => user.cashShifts) 
    user: User;

    @OneToMany(() => Expense, (expense) => expense.cashShift)
    expenses: Expense[];

    @ManyToOne(() => Checkout, (checkout) => checkout.cashShifts)
    checkout: Checkout;

    @OneToMany(() => Order, (order) => order.cashShift)
    orders: Order[];

    @Column({type: "decimal", precision: 10, scale: 2})
    openingAmount: number;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0})
    totalExpenses: number; 

    @Column({type: "decimal", precision: 10, scale: 2, nullable: true})
    systemCashAmount: number; 

    @Column({type: "decimal", precision: 10, scale: 2, nullable: true})
    systemVirtualAmount: number;

    @Column({type: "decimal", precision: 10, scale: 2, nullable: true, default: 0})
    closedCashAmount: number; 

    @Column({type: "decimal", precision: 10, scale: 2, nullable: true, default: 0})
    closedVirtualAmount: number; 

    @Column({type: "decimal", precision: 10, scale: 2, nullable: true})
    difference: number;
}