import { IsArray, IsDate, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { OrderItemDto } from "./create-order.dto";
import { CreateDateColumn } from "typeorm";

export class BillDto {

    @IsNumber()
    tableId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];

    @IsNumber()
    totalAmount: number;

    @IsDate()
    createdAt: Date;
}