import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CashShiftsService } from './cash-shifts.service';
import { OpenBoxDto } from './dto/create-cash-shift.dto';
import { CloseBoxDto } from './dto/update-cash-shift.dto';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@Controller('cash-shifts')
export class CashShiftsController {
  constructor(private readonly cashShiftsService: CashShiftsService) {}

  @Post('/open')
  @ApiOperation({ summary: 'Abrir una caja' })
  openBox(@Body() createCashShiftDto: OpenBoxDto) {
    return this.cashShiftsService.openBox(createCashShiftDto);
  }

  @Patch(':id/close')
  @ApiOperation({ summary: 'Cerrar una caja' })
  closeBox(@Body() closeBoxDto: CloseBoxDto) {
    return this.cashShiftsService.closeBox(closeBoxDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las cajas' })
  findAll() {
    return this.cashShiftsService.findAll();
  }

  @Get(':numeroDeCaja')
  @ApiOperation({ summary: 'Obtener una caja por número de caja' })
  findOne(@Param('numeroDeCaja') numeroDeCaja: string) {
    return this.cashShiftsService.findOne(+numeroDeCaja);
  }

  @Get('by-date/:date')
  @ApiOperation({ summary: 'Obtener cajas por fecha' })
  findByDate(@Param('date') date: string) {
    return this.cashShiftsService.findByDate(new Date(date));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una caja por ID' })
  remove(@Param('id') id: string) {
    return this.cashShiftsService.remove(+id);
  }
}
