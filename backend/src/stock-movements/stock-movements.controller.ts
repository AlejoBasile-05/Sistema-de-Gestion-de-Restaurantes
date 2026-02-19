import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movement.dto';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo movimiento de stock' })
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos de stock' })
  findAll() {
    return this.stockMovementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento de stock por ID' })
  findOne(@Param('id') id: string) {
    return this.stockMovementsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimiento de stock por ID' })
  update(@Param('id') id: string, @Body() updateStockMovementDto: UpdateStockMovementDto) {
    return this.stockMovementsService.update(+id, updateStockMovementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un movimiento de stock por ID' })
  remove(@Param('id') id: string) {
    return this.stockMovementsService.remove(+id);
  }
}
