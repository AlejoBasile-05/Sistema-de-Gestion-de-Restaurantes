import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';

import { Product } from 'src/products/entities/product.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { OrderItem } from './entities/order-item.entity';
import { StockMovement } from 'src/stock-movements/entities/stock-movement.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TypeOrmModule.forFeature([Ingredient, Product, Order, OrderItem, StockMovement])],
})
export class OrdersModule {}
