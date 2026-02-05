import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../entities/order.entity';
import { IsEnum } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
