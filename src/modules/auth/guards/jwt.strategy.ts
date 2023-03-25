/* eslint-disable class-methods-use-this */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { UserLoginResponseDto } from '../dtos/auth.result.login-service.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.JWT_PRIVATE_KEY,
      algorithm: 'HS512',
    });
  }

  async validate(payload: UserLoginResponseDto) {
    return {
      _id: payload._id,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      statusLogin: payload.statusLogin,
      profileId: payload.profile._id,
      profile: payload.profile,
    };
  }

  verifyToken(token: string) {
    let payload: UserLoginResponseDto = null;
    try {
      payload = this.jwtService.verify(token, {
        secret: jwtConstants.JWT_PRIVATE_KEY,
      });
    } catch (error) {
      console.log('verify token socket error');
    }
    return payload;
  }
}
