import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto'; // Reutilizaremos este DTO por ahora
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: CreateUserDto) {
    const validation = await this.authService.validateUser(loginDto.dni, loginDto.password)

    if (validation) {
      return await this.authService.login(validation)
    } else {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}