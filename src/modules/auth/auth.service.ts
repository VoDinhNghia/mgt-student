import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, passWord: string) {
    const user = await this.usersService.findByEmailAndPass(email, passWord);
    if (!user) {
      return null;
    }
    await this.usersService.update(user._id, { statusLogin: true });
    return user;
  }

  async login(user: UsersDto) {
    const existUser = await this.validateUser(user.email, user.passWord);
    if (!existUser) {
      return null;
    }
    const payload = {
      email: existUser.email,
      _id: existUser._id,
      role: existUser.role,
      status: existUser.status,
      statusLogin: true,
    };
    return {
      ...payload,
      historyLogin: existUser.historyLogin,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
