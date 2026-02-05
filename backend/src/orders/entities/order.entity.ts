import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';


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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDIENTE })
  status: OrderStatus;  

  @Column({ type: 'int', nullable: true }) 
  tableId: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems: OrderItem[];
}
