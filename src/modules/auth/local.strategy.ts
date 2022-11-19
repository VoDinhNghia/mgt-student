import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersDto } from '../users/dto/users.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, passWord: string): Promise<UsersDto> {
    const user = await this.authService.validateUser(email, passWord);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
