import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CheckoutsService } from './checkouts.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@Controller('checkouts')
export class CheckoutsController {
  constructor(private readonly checkoutsService: CheckoutsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo checkout' })
  create(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.checkoutsService.create(createCheckoutDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los checkouts' })
  findAll() {
    return this.checkoutsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un checkout por ID' })
  findOne(@Param('id') id: string) {
    return this.checkoutsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un checkout por ID' })
  update(@Param('id') id: string, @Body() updateCheckoutDto: UpdateCheckoutDto) {
    return this.checkoutsService.update(+id, updateCheckoutDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un checkout por ID' })
  remove(@Param('id') id: string) {
    return this.checkoutsService.remove(+id);
  }
}
