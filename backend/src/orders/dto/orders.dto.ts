import { IsArray, IsDate, IsEnum, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { OrderItemDto } from "./create-order.dto";

export enum MetodoDePago {
    EFECTIVO= "Efectivo",
    TARJETA= "Tarjeta",
}

export class OrdersDto {

    @IsNumber()
    tableId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];

    @IsEnum(MetodoDePago)
    paymentMethod: MetodoDePago | null;

    @IsNumber()
    totalAmount: number;

    @IsDate()
    createdAt: Date;
}