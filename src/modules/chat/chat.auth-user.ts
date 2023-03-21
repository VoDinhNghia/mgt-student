import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../auth/guards/constants';

@Injectable()
export class AuthenChatService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getUserFromAuthenticationToken(token: string) {
    const payload: any = this.jwtService.verify(token, {
      secret: this.configService.get(jwtConstants.secret),
    });
    if (payload.userId) {
      return payload;
    }
  }
}
