import { IsInt, IsNumber } from "class-validator";
import { Checkout } from "src/checkouts/entities/checkout.entity";

export class OpenBoxDto {

    @IsInt()
    cashRegisterNumber: number;

    @IsNumber()
    openingAmount: number;
}
