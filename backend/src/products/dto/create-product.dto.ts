import { Type } from 'class-transformer';
import { IsString, IsNumber, IsInt, IsArray, ValidateNested } from 'class-validator';

class ProductIngredientDto {
    @IsInt()
    ingredientId: number;

    @IsNumber()
    quantity: number;
}

export class CreateProductDto {

    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsArray()
    @ValidateNested({ each: true }) // Valida el contenido
    @Type(() => ProductIngredientDto) // Convierte el JSON a clase
    productIngredients: ProductIngredientDto[];
}
