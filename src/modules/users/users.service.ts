import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
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
    usersCreateDto: UsersCreateDto,
    createBy: string,
  ): Promise<Users | unknown> {
    usersCreateDto.passWord = cryptoPassWord(usersCreateDto.passWord);
    const createUser = await new this.userSchema({
      ...usersCreateDto,
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
    const result = this.getProfileUser({
      userId: new Types.ObjectId(createUser._id),
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

  async update(id: string, payload: object, updateBy = '') {
    let updateInfo = payload;
    if (updateBy) {
      updateInfo = {
        ...updateInfo,
        updatedBy: updateBy,
      };
    }
    this.userSchema.findByIdAndUpdate(id, updateInfo);
    const result = await this.getProfileUser({ userId: id });
    return result;
  }

  async importUser(createBy: string, file: unknown) {
    return {
      createBy,
      file,
    };
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
