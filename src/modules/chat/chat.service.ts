import { Injectable } from '@nestjs/common';
import { JwtStrategy } from '../auth/guards/auth.jwt-strategy.guard';

@Injectable()
export class ChatService {
  constructor(private readonly jwtStrategy: JwtStrategy) {}

  async getUserFromSocket(token: string) {
    const user = await this.jwtStrategy.verifyToken(token);
    console.log('userr', user);
    return user;
  }
}
