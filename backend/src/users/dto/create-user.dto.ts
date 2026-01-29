import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  dni: number;
  password: string;
  name?: string;
  role?: UserRole;
}