import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from 'src/users/entities/user.entity';


export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  LISTO = 'LISTO',
  CANCELADO = 'CANCELADO',
  ENTREGADO = 'ENTREGADO',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDIENTE })
  status: OrderStatus;  

  @Column({ type: 'int', nullable: true }) 
  tableId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];
}
