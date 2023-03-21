import { Injectable } from '@nestjs/common';
import { UsersDto } from '../users/dto/users.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { cryptoPassWord } from 'src/constants/crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { collectionNames, EstatusUser } from 'src/constants/constant';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
  ) {}

  async login(userDto: UsersDto): Promise<Users | any> {
    const { email, passWord } = userDto;
    const user = await this.findUserAuth(email, passWord);
    if (!user) {
      new CommonException(401, `User or password incorrect.`);
    }
    await this.updateUserAuth(user._id);
    const payload: Record<string, any> = {
      ...user,
      statusLogin: true,
    };
    const result: Record<string, any> = {
      ...payload,
      historyLogin: user.historyLogin,
      accessToken: this.jwtService.sign(payload),
    };
    return result;
  }

  async findUserAuth(email: string, passWord: string): Promise<Users | any> {
    const password = cryptoPassWord(passWord);
    const match: Record<string, any> = {
      $match: { email, passWord: password, status: EstatusUser.ACTIVE },
    };
    const lookup: any = new LookupCommon([
      {
        from: collectionNames.profiles,
        localField: '_id',
        foreignField: 'user',
        as: 'profile',
        unwind: true,
      },
    ]);
    const project: Record<string, any>[] = [
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

  async updateUserAuth(id: string): Promise<void> {
    await this.userSchema.findByIdAndUpdate(id, { statusLogin: true });
  }
}
