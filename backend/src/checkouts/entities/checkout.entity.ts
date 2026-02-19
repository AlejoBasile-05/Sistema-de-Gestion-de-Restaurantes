import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CashShift } from "src/cash-shifts/entities/cash-shift.entity";

@Entity()
export class Checkout {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    numeroDeCaja: number

    @Column({nullable: true})
    area: string

    @OneToMany(() => CashShift, (cashShift) => cashShift.checkout)
    cashShifts: CashShift[];
}
