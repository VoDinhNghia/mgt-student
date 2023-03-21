import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../auth/guards/constants';

@Injectable()
export class AuthenChatService extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  public async getUserFromAuthenticationToken(token: string) {
    try {
      const payload: any = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      if (payload?.userId) {
        return payload;
      }
    } catch (error) {
      console.log('verify token socket error');
    }
  }
}
