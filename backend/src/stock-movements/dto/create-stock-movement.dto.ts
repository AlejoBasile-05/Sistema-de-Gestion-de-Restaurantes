import { IsNumber, IsEnum, IsInt, IsNotEmpty, IsPositive} from 'class-validator';
import { MovementType } from '../entities/stock-movement.entity';

export class CreateStockMovementDto {
    @IsInt()
    @IsNotEmpty()
    ingredientId: number;

    @IsEnum(MovementType)
    @IsNotEmpty()
    type: MovementType;

    @IsNumber()
    @IsPositive()
    quantity: number;
}
