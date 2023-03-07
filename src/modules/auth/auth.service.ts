import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonException } from 'src/exceptions/exeception.common-error';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, passWord: string) {
    const user = await this.usersService.findUserAuth(email, passWord);
    if (!user) {
      new CommonException(401, `User or password incorrect.`);
    }
    await this.usersService.updateUserAuth(user._id);
    return user;
  }

  async login(userDto: UsersDto) {
    const user = await this.validateUser(userDto.email, userDto.passWord);
    const payload = {
      ...user,
      statusLogin: true,
    };
    return {
      ...payload,
      historyLogin: user.historyLogin,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
