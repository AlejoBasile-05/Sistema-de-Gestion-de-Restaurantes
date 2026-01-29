import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

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

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MOZO,
  })
  role: UserRole;

}