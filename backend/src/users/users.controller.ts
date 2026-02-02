import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ActiveUser } from 'src/common/decorator/active-user.decorator';
import type { ActiveUserInterface } from 'src/common/interfaces/active-user.interfaces';
import * as bcrypt from 'bcrypt';
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseInterceptors(ClassSerializerInterceptor) 
  @Get('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles('admin', 'cocinero') // Define quiénes pueden ver su propio perfil
  async getProfile(@ActiveUser() user: ActiveUserInterface) {
    const userEntity = await this.usersService.findOne(user.id);

    return userEntity;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll(@ActiveUser() user: ActiveUserInterface) {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    if (updateUserDto.password) {

      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.usersService.update(+id, updateUserDto);

    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
