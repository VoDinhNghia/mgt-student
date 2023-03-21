import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { cryptoPassWord } from 'src/constants/crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EstatusUser } from 'src/constants/constant';
import { LookupService } from 'src/utils/lookup.query.service';
import { LoginDto } from './dtos/auth.login.dto';
import { UserLoginResponseDto } from './dtos/response.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
  ) {}

  async login(loginDto: LoginDto): Promise<UserLoginResponseDto> {
    const { email, passWord } = loginDto;
    const user = await this.findUserAuth(email, passWord);
    if (!user) {
      new CommonException(401, `User or password incorrect.`);
    }
    await this.userSchema.findByIdAndUpdate(user._id, { statusLogin: true });
    const result: Record<string, any> = {
      ...user,
      statusLogin: true,
      historyLogin: user.historyLogin,
      accessToken: this.jwtService.sign({ ...user }),
    };
    return result;
  }

  async findUserAuth(email: string, passWord: string): Promise<Users | any> {
    const password = cryptoPassWord(passWord);
    const match: Record<string, any> = {
      $match: { email, passWord: password, status: EstatusUser.ACTIVE },
    };
    const lookup = new LookupService().user();
    const project = [
      {
        $project: {
          _id: 1,
          email: 1,
          role: 1,
          status: 1,
          'profile._id': 1,
          'profile.firstName': 1,
          'profile.lastName': 1,
          'profile.middleName': 1,
        },
      },
    ];
    const aggregate = [match, ...lookup, ...project];
    const result = await this.userSchema.aggregate(aggregate);
    return result[0] ?? null;
  }
}
