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

  async validateUser(email: string, passWord: string): Promise<UsersDto> {
    const user = await this.usersService.findOne(email, passWord);
    if (!user) {
      return null;
    }
    return user;
  }
  //write function update statusLogin and add history
  // write function hash password
  async login(user: UsersDto & { _id: Types.ObjectId } | any) {
    const existUser: any = await this.validateUser(user.email, user.passWord);
    if (!existUser) {
      return null;
    }
    const payload = { email: user.email, _id: user._id };
    return {
      email: existUser.email,
      _id: existUser._id,
      statusLogin: existUser.statusLogin,
      status: existUser.status,
      role: existUser.role,
      historyLogin: existUser.historyLogin,
      access_token: this.jwtService.sign(payload),
    };
  }
}
