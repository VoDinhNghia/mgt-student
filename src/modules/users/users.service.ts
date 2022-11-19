import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersCreateDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/commons/crypto';
import { roles, statusUser } from 'src/commons/constants';
import { UsersFillterDto } from './dto/user.filter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  async create(
    UsersCreateDto: UsersCreateDto,
    createBy: string,
  ): Promise<Users> {
    UsersCreateDto.passWord = cryptoPassWord(UsersCreateDto.passWord);
    const createUser = await new this.userSchema({
      ...UsersCreateDto,
      createdBy: createBy,
      createdAt: new Date(),
    }).save();
    if (!createUser.id) {
      return null;
    }
    try {
      await new this.profileSchema({
        ...UsersCreateDto,
        userId: createUser._id,
        createdAt: new Date(),
      }).save();
    } catch (error) {
      await this.userSchema.findByIdAndDelete(createUser._id).exec();
      return null;
    }
    return this.getProfileUser({ userId: new Types.ObjectId(createUser._id) });
  }

  async findByEmailAndPass(email: string, passWord: string) {
    const pass = cryptoPassWord(passWord);
    return await this.userSchema.findOne({
      email,
      pass,
      status: statusUser.ACTIVE,
    });
  }

  async findByEmail(email: string) {
    return this.userSchema.findOne({ email });
  }

  async getProfileUser(query: object): Promise<any> {
    return this.profileSchema
      .find(query)
      .populate('user', '', this.userSchema)
      .exec();
  }

  async getAll(query: UsersFillterDto) {
    const { userIds, searchKey, limit, page } = query;
    const match: any = {};
    if (userIds && userIds.length > 0) {
      match.user = { $in: userIds };
    }
    if (searchKey) {
      match.$or = [
        {
          firstName: new RegExp(searchKey),
          lastName: new RegExp(searchKey),
        },
      ];
    }
    const result = this.profileSchema
      .find(match)
      .populate('user', '', this.userSchema)
      .limit(Number(limit))
      .skip(Number(limit) * Number(page) - Number(limit))
      .exec();
    return result;
  }

  async update(id: string, payload: object, updateBy = '') {
    let updateInfo = payload;
    if (updateBy) {
      updateInfo = {
        ...updateInfo,
        updatedBy: updateBy,
      };
    }
    this.userSchema.findByIdAndUpdate(id, updateInfo);
    return await this.getProfileUser({ userId: id });
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
    let createAdmin;
    let createProfileAdmin;
    if (!existedAdmin) {
      try {
        createAdmin = await new this.userSchema({
          ...info,
          createdAt: new Date(),
        }).save();
      } catch (error) {
        console.log(error);
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
          console.log(error);
        }
        if (!createProfileAdmin) {
          this.userSchema.findByIdAndDelete(createAdmin._id);
        }
      }
    }
    return createAdmin;
  }
}
