import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './entities/order.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveUser } from 'src/common/decorator/active-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GetStatsQueryDto } from './dto/get-stats-query.dto';
import { MetodoDePago } from './dto/orders.dto';
import { BillDto } from './dto/bill.dto';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  create(@Body() createOrderDto: CreateOrderDto, @ActiveUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes con filtro por estado' })
  findAll(@Query('status') status: OrderStatus) {
    return this.ordersService.findAll(status);
  }
  
  @Get('bill')
  @ApiOperation({ summary: 'Obtener las órdenes de una mesa específica' })
  findForTables(@Query('tableId', ParseIntPipe) tableId: number) {
    return this.ordersService.findForTable(+tableId);
  }

  @Get('tables-status')
  @ApiOperation({ summary: 'Obtener estado de ocupación del restaurante' })
  async getTablesStatus() {
    return this.ordersService.getRestaurantStatus();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de una fecha específica o del día actual' })
  async getStats(@Query('date') date: GetStatsQueryDto) {
    return this.ordersService.getDailyStats(date);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Obtener órdenes dentro de un rango de fechas' })
  async getOrdersByDateRange(@Query('start') start: Date, @Query('end') end: Date) {
    return this.ordersService.findForDate(start, end);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado de una orden por ID' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, updateOrderDto);
  }

  
  @Patch('pay/:tableId')
  @ApiOperation({ summary: 'Marcar todas las órdenes de una mesa como PAGADO' })
  async payBill(@Param('tableId') tableId: number, @Body() paymentMethod: BillDto) {
    return this.ordersService.payBill(tableId, paymentMethod);
}

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar una orden por ID' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
