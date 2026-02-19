import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { CashShiftsModule } from './cash-shifts/cash-shifts.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CheckoutsModule } from './checkouts/checkouts.module';

@Module({
imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin_restaurante',
      password: 'password_seguro_123',
      database: 'restaurante_db', 
      autoLoadEntities: true, 
      synchronize: true, 
    }),
    UsersModule,
    AuthModule,
    IngredientsModule,
    StockMovementsModule,
    ProductsModule,
    OrdersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CashShiftsModule,
    ExpensesModule,
    CheckoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
