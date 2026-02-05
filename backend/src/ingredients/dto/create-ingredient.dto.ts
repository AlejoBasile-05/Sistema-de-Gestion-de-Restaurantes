import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { Unidades } from '../entities/ingredient.entity';

export class CreateIngredientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(Unidades)
    @IsNotEmpty()
    unit: Unidades;

    @IsNumber()
    @IsNotEmpty()
    cost: number;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsNumber()
    @IsNotEmpty()
    minStock: number;

    @IsString()
    @IsNotEmpty()
    category: string;
}
