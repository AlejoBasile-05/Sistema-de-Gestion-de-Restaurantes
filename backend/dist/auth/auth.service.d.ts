import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interfaces';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(dni: number, pass: string): Promise<any>;
    login(user: ActiveUserInterface): Promise<{
        access_token: string;
    }>;
}
