import { Module } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  imports: [TypeOrmModule.forFeature([StockMovement, Ingredient])],
})
export class StockMovementsModule {}
