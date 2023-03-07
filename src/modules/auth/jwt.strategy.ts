import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Record<string, any>) {
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
}
