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

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @ActiveUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(@Query('status') status: OrderStatus) {
    return this.ordersService.findAll(status);
  }
  
  @Get('bill')
  findForTables(@Query('tableId', ParseIntPipe) tableId: number) {
    return this.ordersService.findForTable(+tableId);
  }

  @Get('tables-status')
  @ApiOperation({ summary: 'Obtener estado de ocupación del restaurante' })
  async getTablesStatus() {
    return this.ordersService.getRestaurantStatus();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de una fecha específica o del día actual' })
  async getStats(@Query('date') date: GetStatsQueryDto) {
    return this.ordersService.getDailyStats(date);
  }

  @Patch(':id')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateStatus(id, updateOrderDto);
  }

  
  @Patch('pay/:tableId') // 🛠️ Definimos el parámetro en la ruta
  @ApiOperation({ summary: 'Marcar todas las órdenes de una mesa como PAGADO' })
  async payBill(@Param('tableId') tableId: number) {
    return this.ordersService.payBill(tableId);
}

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
