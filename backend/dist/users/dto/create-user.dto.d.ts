import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    dni: number;
    password: string;
    name?: string;
    role?: UserRole;
}
