import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/commons/crypto';
import { roles, statusUser } from 'src/commons/constants';
import { UsersFillterDto } from './dto/user.filter.dto';
import { validateEmail } from 'src/commons/validateEmail';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Pagination } from 'src/abstracts/pagePagination';
import { UpdateProfileDto } from './dto/user.update-profile.dto';
import {
  LeaderSchool,
  LeaderSchoolDocument,
} from './schemas/users.leader-school.schema';
import { CreateLeaderSchoolDto } from './dto/user.create.leader-school.dto';
import { QueryLeaderSchoolDto } from './dto/user.query.leader-school.dto';
import { UpdateLeaderSchoolDto } from './dto/user.update.leader-school.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(LeaderSchool.name)
    private readonly leaderSchoolSchema: Model<LeaderSchoolDocument>,
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
    usersDto: CreateUserDto,
    createBy: string,
  ): Promise<Users | any> {
    await this.validateUser(usersDto);
    usersDto.passWord = cryptoPassWord(usersDto.passWord);
    const user = await new this.userSchema({
      ...usersDto,
      createdBy: createBy,
    }).save();
    await this.createUserProfile({
      ...usersDto,
      user: user._id,
    });
    const result = this.findUserById(user._id);

    return result;
  }

  async findUserAuth(email: string, passWord: string): Promise<Users | any> {
    const password = cryptoPassWord(passWord);
    const result = await this.userSchema
      .findOne({
        email,
        passWord: password,
        status: statusUser.ACTIVE,
      })
      .lean();
    return result;
  }

  async updateUserAuth(id: string): Promise<void> {
    await this.userSchema.findByIdAndUpdate(id, { statusLogin: true });
  }

  async findUserById(id: string | any): Promise<Users | any> {
    const result = await this.userSchema.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: 'user',
          as: 'profile',
        },
      },
      { $unwind: '$profile' },
    ]);
    if (!result[0]) {
      new CommonException(404, 'User not found.');
    }
    return result[0];
  }

  async findAllUsers(query: UsersFillterDto, userId: string): Promise<Users[]> {
    const { searchKey, limit, page, role, status } = query;
    const match: Record<string, any> = {
      $match: { _id: { $ne: new Types.ObjectId(userId) } },
    };
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
        as: 'profile',
      },
    };
    aggregate = [...aggregate, match, lookup, { $unwind: '$profile' }];
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

  async updateUser(
    id: string,
    payload: Record<string, any>,
    updatedBy: string,
  ): Promise<Users> {
    if (payload.email) {
      await this.validateUser(payload);
    }
    if (payload.passWord) {
      payload.passWord = cryptoPassWord(payload.passWord);
    }
    const updateInfo = {
      ...payload,
      updatedBy,
      updateAt: Date.now(),
    };
    await this.userSchema.findByIdAndUpdate(id, updateInfo);
    const result = await this.findUserById(id);
    return result;
  }

  async updateUserProfile(
    id: string,
    profileDto: UpdateProfileDto,
  ): Promise<Profile | any> {
    const profile = await this.profileSchema.findByIdAndUpdate(id, profileDto);
    const result = await this.findUserById(profile.user);
    return result;
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
    const adminDto = {
      email: 'admin.students@gmail.com',
      passWord: cryptoPassWord('123Code#'),
      status: statusUser.ACTIVE,
      statusLogin: false,
      role: roles.ADMIN,
    };
    const options = { email: adminDto.email };
    await this.validateField.existed(this.userSchema, options, 'Admin');
    const admin = await new this.userSchema(adminDto).save();
    await this.createUserProfile({
      firstName: 'Admin',
      lastName: 'Student',
      user: admin._id,
    });
    const result = await this.findUserById(admin._id);
    return result;
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

  async createLeaderSchool(
    leaderSchoolDto: CreateLeaderSchoolDto,
  ): Promise<LeaderSchool> {
    const profile = await this.profileSchema.findById(leaderSchoolDto.profile);
    if (!profile) {
      new CommonException(404, 'User profile not found.');
    }
    const leaderSchool = await this.leaderSchoolSchema.findOne({
      profile: new Types.ObjectId(leaderSchoolDto.profile),
    });
    if (leaderSchool) {
      new CommonException(409, 'User profile existed already.');
    }
    const createLeaderSchool = await new this.leaderSchoolSchema(
      leaderSchoolDto,
    ).save();
    const result = await this.findLeaderSchoolById(createLeaderSchool._id);
    return result;
  }

  async findLeaderSchoolById(id: string): Promise<LeaderSchool> {
    const result = await this.leaderSchoolSchema
      .findById(id)
      .populate('profile', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Leader school not found.');
    }
    return result;
  }

  async updateLeaderSchool(
    id: string,
    updateLeaderDto: UpdateLeaderSchoolDto,
  ): Promise<LeaderSchool> {
    await this.leaderSchoolSchema.findByIdAndUpdate(id, updateLeaderDto);
    const result = await this.findLeaderSchoolById(id);
    return result;
  }

  async findAllLeaderSchool(
    queryDto: QueryLeaderSchoolDto,
  ): Promise<LeaderSchool[]> {
    const { type } = queryDto;
    const match = { $match: {} };
    if (type) {
      match.$match = {
        'title.type': type,
      };
    }
    const results = await this.leaderSchoolSchema
      .find(match)
      .populate('profile', '', this.profileSchema)
      .exec();
    return results;
  }

  async deleteLeaderSchool(id: string): Promise<void> {
    await this.leaderSchoolSchema.findByIdAndDelete(id);
  }
}
