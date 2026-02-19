import { IsInt, IsString, Min } from "class-validator";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateCheckoutDto {

    @IsInt({ message: 'El número de caja debe ser un número entero' })
    @Min(1, { message: 'El número de caja debe ser positivo' }) 
    numeroDeCaja: number;

    @IsString()
    area: string
}
