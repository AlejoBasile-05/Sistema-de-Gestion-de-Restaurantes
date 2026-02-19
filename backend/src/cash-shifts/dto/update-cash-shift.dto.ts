import { PartialType } from '@nestjs/swagger';
import { OpenBoxDto } from './create-cash-shift.dto';
import { IsNumber } from 'class-validator';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CloseBoxDto extends PartialType(OpenBoxDto) {

    @Type(() => Date)
    @IsDate()
    closingDate: Date;

    @IsNumber()
    closedCashAmount: number;

    @IsNumber()
    closedVirtualAmount: number;

}