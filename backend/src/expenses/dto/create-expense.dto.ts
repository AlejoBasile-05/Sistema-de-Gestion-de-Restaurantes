import { IsDate, IsEnum, IsInt, IsNumber, IsString } from "class-validator";
import { ExpenseType } from "../entities/expense.entity";
import { Type } from "class-transformer";


export class CreateExpenseDto {
    @IsNumber()
    amount: number;

    @IsNumber()
    cashShiftId: number;

    @IsEnum(ExpenseType)
    type: ExpenseType;

    @IsString()
    description: string

    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsInt()
    usuarioId: number;
}
