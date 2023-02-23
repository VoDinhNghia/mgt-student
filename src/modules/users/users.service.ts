import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersCreateDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/commons/crypto';
import { roles, statusUser } from 'src/commons/constants';
import { UsersFillterDto } from './dto/user.filter.dto';
import { validateEmail } from 'src/commons/validateEmail';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Pagination } from 'src/abstracts/pagePagination';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    private readonly validateField: ValidateField,
  ) {}

  async validateUser(usersValidateDto: Record<string, any>): Promise<void> {
    if (!validateEmail(usersValidateDto.email)) {
      new CommonException(400, `Email not correct format.`);
    }
    const options = { email: usersValidateDto.email };
    await this.validateField.existed(this.userSchema, options, 'Email');
  }

  async createUser(
    usersCreateDto: UsersCreateDto,
    createBy: string,
  ): Promise<Users | any> {
    await this.validateUser(usersCreateDto);
    usersCreateDto.passWord = cryptoPassWord(usersCreateDto.passWord);
    const createUser = await new this.userSchema({
      ...usersCreateDto,
      createdBy: createBy,
      createdAt: new Date(),
    }).save();
    await this.createUserProfile({
      ...UsersCreateDto,
      user: createUser._id,
      createdAt: new Date(),
    });
    const result = this.getProfileUser({
      user: new Types.ObjectId(createUser._id),
    });

    return result;
  }

  async findByEmailAndPass(email: string, passWord: string) {
    const pass = cryptoPassWord(passWord);
    return this.userSchema.findOne({
      email,
      passWord: pass,
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
    const aggPagination: any = new Pagination(limit, page, aggregate);
    const result = await this.userSchema.aggregate(aggPagination);
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
    const options = { email: info.email };
    await this.validateField.existed(this.userSchema, options, 'Admin');
    const createAdmin = await new this.userSchema({
      ...info,
      createdAt: new Date(),
    }).save();
    await this.createUserProfile({
      firstName: 'Admin',
      lastName: 'Student',
      user: createAdmin._id,
      createdAt: new Date(),
    });

    return createAdmin;
  }

  async createUserProfile(profileDto: Record<string, any>): Promise<void> {
    try {
      const options = { user: profileDto.user };
      await this.validateField.existed(this.profileSchema, options, 'Profile');
      await new this.profileSchema(profileDto).save();
    } catch {
      await this.userSchema.findByIdAndDelete(profileDto.user);
      new CommonException(500, `Server interval.`);
    }
  }
}
