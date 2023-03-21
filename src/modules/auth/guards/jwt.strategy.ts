import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { UserLoginResponseDto } from '../dtos/response.login.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: UserLoginResponseDto) {
    return {
      userId: payload._id,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      statusLogin: payload.statusLogin,
      profileId: payload.profile._id,
      profile: payload.profile,
    };
  }

  verifyToken(token: string) {
    try {
      const payload: UserLoginResponseDto = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      return payload;
    } catch (error) {
      console.log('verify token socket error');
    }
  }
}
