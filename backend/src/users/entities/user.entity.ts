import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { Exclude } from "class-transformer"
import { Order } from 'src/orders/entities/order.entity';

export enum UserRole {
  MOZO = 'mozo',
  COCINERO = 'cocinero',
  ADMIN = 'admin',
}

@Entity()
export class User {

  @PrimaryGeneratedColumn() // Es como el autoincrement de toda la vida, te genera automaticamente el id
  id: number;

  @Column({ unique: true, type: 'bigint' }) 
  dni: number;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MOZO,
  })
  role: UserRole;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order.user) orders: Order[];

}