import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from 'src/users/entities/user.entity';
import { MetodoDePago } from '../dto/orders.dto';
import { CashShift } from 'src/cash-shifts/entities/cash-shift.entity';


export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  LISTO = 'LISTO',
  CANCELADO = 'CANCELADO',
  ENTREGADO = 'ENTREGADO',
  PAGADO = 'PAGADO'
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({type: 'timestamptz', nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  cashShiftId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: MetodoDePago, nullable: true })
  paymentMethod: MetodoDePago;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDIENTE })
  status: OrderStatus;  

  @Column({ type: 'int', nullable: true }) 
  tableId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];

  @ManyToOne(() => CashShift, (cashShift) => cashShift.orders, { nullable: true })
  @JoinColumn({ name: 'cashShiftId' })
  cashShift: CashShift | null;
}
