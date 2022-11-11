import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, passWord: string) {
    const user = await this.usersService.findOne(email, passWord);
    if (!user) {
      return null;
    }
    return user;
  }
  //write function update statusLogin and add history
  // write function hash password
  async login(user: UsersDto) {
    const existUser: any = await this.validateUser(user.email, user.passWord);
    if (!existUser) {
      return null;
    }
    const payload = {
      email: existUser.email,
      _id: existUser._id,
      role: existUser.role,
      status: existUser.status,
      statusLogin: existUser.statusLogin,
    };
    return {
      ...payload,
      historyLogin: existUser.historyLogin,
      access_token: this.jwtService.sign(payload),
    };
  }
}
