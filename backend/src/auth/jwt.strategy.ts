import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ActiveUserInterface } from 'src/common/interfaces/active-user.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      ignoreExpiration: false,
      
      secretOrKey: process.env.JWT_SECRET || 'secreto_temporal_para_dev',
    });
  }

  async validate(payload: ActiveUserInterface) {
    return { id: payload.id, dni: payload.dni, role: payload.role };
  }
}