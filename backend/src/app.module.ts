import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { CashShiftsModule } from './cash-shifts/cash-shifts.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CheckoutsModule } from './checkouts/checkouts.module';

@Module({
imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
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
