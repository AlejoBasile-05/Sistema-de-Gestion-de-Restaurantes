import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { Exclude } from "class-transformer"

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

}