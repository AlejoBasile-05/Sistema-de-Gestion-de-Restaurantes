import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(dni: number, pass: string): Promise<any> {
        const user = await this.usersService.findOneByDNI(dni);

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        
        return null;
    }

    async login(user: any) {
        // 'sub' es el estándar para el ID del usuario en JWT
        const payload = { sub: user.id, dni: user.dni, role: user.role };
        
        return {
        access_token: this.jwtService.sign(payload),
        };
    }
}
