import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { OrderItemDto } from "./create-order.dto";
import { MetodoDePago } from "./orders.dto";

export class BillDto {

    @IsNotEmpty({ message: 'El método de pago es obligatorio' })
    @IsEnum(MetodoDePago, { message: 'Método de pago inválido. Debe ser EFECTIVO o TARJETA' })
    paymentMethod: MetodoDePago;

}