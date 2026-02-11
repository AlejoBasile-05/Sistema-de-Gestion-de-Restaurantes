import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {

  @IsNumber()
  dni: number;

  @IsString()
  password: string;

  @IsString()
  name?: string;

  @IsEnum(UserRole)
  role?: UserRole;
}