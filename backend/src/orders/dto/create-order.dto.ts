import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, Validate, ValidateNested } from 'class-validator';

export class CreateOrderDto {
    @IsInt()
    tableId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];
}

class OrderItemDto {
    @IsInt()
    productId: number;

    @IsInt()
    @Min(1)
    quantity: number;
}