import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersCreateDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/commons/crypto';
import { roles, statusUser } from 'src/commons/constants';
import { UsersFillterDto } from './dto/user.filter.dto';
import { validateEmail } from 'src/commons/validateEmail';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  async validateUser(usersValidateDto: Record<string, any>): Promise<void> {
    if (!validateEmail(usersValidateDto.email)) {
      throw new HttpException(
        { statusCode: 400, error: 'Email not correct format.' },
        400,
      );
    }
    const existedUser = await this.findByEmail(usersValidateDto.email);
    if (existedUser) {
      throw new HttpException(
        { statusCode: 400, error: 'Email existed already.' },
        400,
      );
    }
  }

  async createUser(
    usersCreateDto: UsersCreateDto,
    createBy: string,
  ): Promise<Users | any> {
    await this.validateUser(usersCreateDto);
    let createUser: Record<string, any> = {};
    try {
      usersCreateDto.passWord = cryptoPassWord(usersCreateDto.passWord);
      createUser = await new this.userSchema({
        ...usersCreateDto,
        createdBy: createBy,
        createdAt: new Date(),
      }).save();
    } catch {
      throw new HttpException(
        { statusCode: 500, message: 'Server error.' },
        500,
      );
    }
    try {
      await new this.profileSchema({
        ...UsersCreateDto,
        user: createUser._id,
        createdAt: new Date(),
      }).save();
    } catch (error) {
      await this.userSchema.findByIdAndDelete(createUser._id).exec();
      throw new HttpException(
        { statusCode: 500, message: 'Server error.' },
        500,
      );
    }
    const result = this.getProfileUser({
      user: new Types.ObjectId(createUser._id),
    });

    return result;
  }

  async findByEmailAndPass(email: string, passWord: string) {
    const pass = cryptoPassWord(passWord);
    return this.userSchema.findOne({
      email,
      pass,
      status: statusUser.ACTIVE,
    });
  }

  async findUserById(id: string): Promise<Users | any> {
    const result = await this.profileSchema
      .findOne({ user: new Types.ObjectId(id) })
      .populate('user', '', this.userSchema)
      .exec();
    return result;
  }

  async findByEmail(email: string) {
    return this.userSchema.findOne({ email });
  }

  async getProfileUser(query: object): Promise<unknown> {
    return this.profileSchema
      .find(query)
      .populate('user', '', this.userSchema)
      .exec();
  }

  async getAll(query: UsersFillterDto) {
    const { searchKey, limit, page, role, status } = query;
    const match: Record<string, any> = { $match: {} };
    if (role) {
      match.$match.role = role;
    }
    if (status) {
      match.$match.status = status;
    }
    let aggregate: any[] = [];
    const lookup = {
      $lookup: {
        from: 'profiles',
        localField: '_id',
        foreignField: 'user',
        as: 'user',
      },
    };
    aggregate = [...aggregate, match, lookup];
    if (searchKey) {
      aggregate = [
        ...aggregate,
        {
          $match: {
            $or: [
              {
                'user.firstName': new RegExp(searchKey),
                'user.lastName': new RegExp(searchKey),
              },
            ],
          },
        },
      ];
    }
    if (limit && page) {
      aggregate = [
        ...aggregate,
        {
          $skip: Number(limit) * Number(page) - Number(limit),
        },
        { $limit: Number(limit) },
      ];
    }

    const result = await this.userSchema.aggregate(aggregate);
    return result;
  }

  async update(id: string, payload: Record<string, any>, updatedBy = '') {
    if (payload.email) {
      await this.validateUser(payload);
    }
    let updateInfo = payload;
    if (updatedBy) {
      updateInfo = {
        ...updateInfo,
        updatedBy,
      };
    }
    this.userSchema.findByIdAndUpdate(id, updateInfo);
    const result = await this.getProfileUser({ userId: id });
    return result;
  }

  async updateProfile(
    id: string,
    profileDto: Record<string, any>,
    updatedBy: string,
  ): Promise<Profile | any> {
    console.log(id, profileDto, updatedBy);
    return {};
  }

  async importUser(createdBy: string, data: Record<string, any>[]) {
    const result: Record<string, any>[] = [];
    for (const item of data) {
      if (!validateEmail(item.email)) {
        item.status = 'Email incorect format.';
        continue;
      }
      const existedEmail = await this.userSchema.findOne({ email: item.email });
      let user: UsersDocument = null;
      if (existedEmail) {
        item.status = 'Email existed already.';
        result.push(item);
        continue;
      }
      try {
        user = await new this.userSchema({
          ...item,
          passWord: cryptoPassWord('123Code#'),
          createdBy,
        }).save();
      } catch {
        item.status = 'Can not create user.';
        result.push(item);
        continue;
      }
      const existedProfile = await this.profileSchema.findOne({
        user: user._id,
      });
      if (existedProfile || !user) {
        item.status = 'Can not create profile.';
        result.push(item);
        continue;
      }
      try {
        await new this.profileSchema({
          ...item,
          user: user._id,
          createdBy,
        }).save();
        item.status = 'Import user success.';
      } catch {
        item.status = 'Can not create profile.';
        await this.userSchema.findByIdAndDelete(user._id);
        result.push(item);
        continue;
      }
      result.push(item);
    }
    return result;
  }

  async initAdmin() {
    const info = {
      email: 'admin.students@gmail.com',
      passWord: cryptoPassWord('123Code#'),
      status: statusUser.ACTIVE,
      statusLogin: false,
      role: roles.ADMIN,
    };
    const existedAdmin = await this.findByEmail(info.email);
    let createAdmin: Record<string, any>;
    let createProfileAdmin: Record<string, any>;
    if (existedAdmin) {
      throw new HttpException(
        { statusCode: 409, message: 'Admin existed already.' },
        409,
      );
    }
    try {
      createAdmin = await new this.userSchema({
        ...info,
        createdAt: new Date(),
      }).save();
    } catch (error) {
      throw new HttpException(
        { statusCode: 500, message: 'Server error' },
        500,
      );
    }
    if (createAdmin) {
      try {
        createProfileAdmin = await new this.profileSchema({
          firstName: 'Admin',
          lastName: 'Student',
          user: createAdmin._id,
          createdAt: new Date(),
        }).save();
      } catch (error) {
        throw new HttpException(
          { statusCode: 500, message: 'Server error' },
          500,
        );
      }
      if (!createProfileAdmin) {
        this.userSchema.findByIdAndDelete(createAdmin._id);
      }
    }
    return createAdmin;
  }
}
