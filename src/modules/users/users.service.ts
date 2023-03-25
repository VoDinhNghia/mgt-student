import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/constants/crypto';
import {
  EstatusUserProfile,
  ErolesUser,
  EstatusUser,
} from 'src/constants/constant';
import { UsersFillterDto } from './dto/users.query.dto';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { QueryPagination } from 'src/utils/page.pagination';
import { UpdateProfileDto } from './dto/users.update.profile.dto';
import {
  Leader_Schools,
  LeaderSchoolDocument,
} from './schemas/users.leader-school.schema';
import { CreateLeaderSchoolDto } from './dto/users.create.leader-school.dto';
import { QueryLeaderSchoolDto } from './dto/users.query.leader-school.dto';
import { UpdateLeaderSchoolDto } from './dto/users.update.leader-school.dto';
import { getRandomCode } from 'src/utils/generate.code-profile';
import {
  Study_Processes,
  StudyProcessDocument,
} from './schemas/users.study-process.schema';
import { CreateStudyProcessDto } from './dto/users.create.study-process.dto';
import { InitSuperAdminDto } from '../auth/dtos/auth.init-super-admin.dto';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { UsersUpdateDto } from './dto/users.update.dto';
import { collections } from 'src/constants/collections.name';
import { LookupService } from 'src/utils/lookup.query.service';
import { msgNotFound, msgServerError } from 'src/constants/message.response';
import { ImatchFindAllUser } from './interfaces/users.match.find-all.interface';
import { UserProfileDto } from './dto/users.create-profile.dto';
import { ImatchFindLeaderSchool } from './interfaces/users.match.find-leader-school.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Leader_Schools.name)
    private readonly leaderSchoolSchema: Model<LeaderSchoolDocument>,
    @InjectModel(Study_Processes.name)
    private readonly studyProcessSchema: Model<StudyProcessDocument>,
  ) {}

  async createUser(usersDto: CreateUserDto, createdBy: string): Promise<Users> {
    const validate = new ValidateDto();
    await validate.profileDto(usersDto);
    usersDto.passWord = cryptoPassWord(usersDto.passWord);
    const newDto = {
      ...usersDto,
      createdBy,
    };
    const user = await new this.userSchema(newDto).save();
    const profileDto = {
      ...usersDto,
      user: user._id,
      code: getRandomCode(6),
      createdBy,
    };
    const profile = await this.createUserProfile(profileDto);
    if (user.role === ErolesUser.STUDENT) {
      const isCreate = await this.createStudyProcess(
        user._id,
        profile._id,
        createdBy,
      );
      if (!isCreate) {
        new CommonException(500, 'Can not create study process');
      }
    }
    const result = this.findUserById(user._id);
    return result;
  }

  async createStudyProcess(
    userId: string,
    profileId: string,
    createdBy: string,
  ): Promise<boolean> {
    try {
      const studyProcessDto: CreateStudyProcessDto & { createdBy: string } = {
        user: profileId,
        status: EstatusUserProfile.STUDYING,
        createdBy,
      };
      await new this.studyProcessSchema(studyProcessDto).save();
      return true;
    } catch (error) {
      console.log(error);
      await this.userSchema.findByIdAndDelete(userId);
      await this.profileSchema.findByIdAndDelete(profileId);
      return false;
    }
  }

  async findUserById(id: string): Promise<Users> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = new LookupService().user();
    const aggregate = [match, ...lookup];
    const result = await this.userSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllUsers(query: UsersFillterDto, userId: string): Promise<Users[]> {
    const { searchKey, limit, page, role, status } = query;
    const match: ImatchFindAllUser = {
      $match: {
        _id: { $ne: new Types.ObjectId(userId) },
        isDeleted: false,
      },
    };
    if (role) {
      match.$match.role = role;
    }
    if (status) {
      match.$match.status = status;
    }
    const lookup = new LookupService().user();
    let aggregate = [match, ...lookup];
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
    const aggPagination = new QueryPagination().skipLimitAndSort(limit, page);
    const result = await this.userSchema.aggregate([
      ...aggregate,
      ...aggPagination,
    ]);
    return result;
  }

  async updateUser(
    id: string,
    payload: UsersUpdateDto,
    updatedBy: string,
  ): Promise<Users> {
    const { email, passWord } = payload;
    if (email) {
      await new ValidateDto().email(email);
    }
    if (passWord) {
      payload.passWord = cryptoPassWord(passWord);
    }
    const updateInfo = {
      ...payload,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.userSchema.findByIdAndUpdate(id, updateInfo, {
      new: true,
    });
    return result;
  }

  async updateUserProfile(
    id: string,
    profileDto: UpdateProfileDto,
    updatedBy: string,
  ): Promise<Profile> {
    const { award = [] } = profileDto;
    const validate = new ValidateDto();
    await validate.profileDto(profileDto);
    const profileValidate = await validate.awards(profileDto, award);
    const updateProfileDto = {
      ...profileValidate,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.profileSchema.findByIdAndUpdate(
      id,
      updateProfileDto,
      {
        new: true,
      },
    );
    await this.userSchema.findByIdAndUpdate(result.user, {
      updatedAt: Date.now(),
      updatedBy,
    });
    return result;
  }

  async importUser(createdBy: string, data = []) {
    for await (const item of data) {
      const { email, passWord, role, firstName, lastName } = item;
      if (!email || !passWord || !role || !firstName || !lastName) {
        item.statusImport =
          'email || passWord || role || firstName || lastName must provided.';
        continue;
      }
      let user = null;
      let profile = null;
      try {
        const userDto = {
          ...item,
          passWord: cryptoPassWord(passWord || '123Code#'),
          createdBy,
        };
        user = await new this.userSchema(userDto).save();
      } catch {
        item.statusImport = 'Can not create user.';
        continue;
      }
      const existedProfile = await this.profileSchema.findOne({
        user: user._id,
      });
      if (existedProfile || !user) {
        item.statusImport = 'Can not create profile.';
        continue;
      }
      try {
        const profileDto = {
          ...item,
          user: user._id,
          code: getRandomCode(6),
          createdBy,
        };
        profile = await new this.profileSchema(profileDto).save();
      } catch {
        item.statusImport = 'Can not create profile.';
        await this.userSchema.findByIdAndDelete(user._id);
        continue;
      }
      if (user.role === ErolesUser.STUDENT) {
        const isCreate = await this.createStudyProcess(
          user._id,
          profile._id,
          createdBy,
        );
        if (!isCreate) {
          item.statusImport = 'Can not create study process.';
          continue;
        }
      }
      item.statusImport = 'Import user success.';
    }
    return data;
  }

  async initSupperAdmin(superAdminDto: InitSuperAdminDto): Promise<Users> {
    const { email, passWord, firstName, lastName } = superAdminDto;
    const option = { role: ErolesUser.SUPPER_ADMIN };
    await new ValidateDto().existedByOptions(
      collections.users,
      option,
      'Supper Admin',
    );
    const supperAdminDto = {
      email,
      passWord: cryptoPassWord(passWord || '123Code#'),
      status: EstatusUser.ACTIVE,
      statusLogin: false,
      role: ErolesUser.SUPPER_ADMIN,
    };
    const supperAdmin = await new this.userSchema(supperAdminDto).save();
    const profileSuperAdmin = {
      firstName,
      lastName,
      user: supperAdmin._id,
      code: `SA_${getRandomCode(5)}`,
    };
    await this.createUserProfile(profileSuperAdmin);
    const result = await this.findUserById(supperAdmin._id);
    return result;
  }

  async validateNumberAdmin(): Promise<boolean> {
    const result = await this.userSchema.find({
      role: ErolesUser.ADMIN,
    });
    if (result.length > 5) {
      return false;
    }
    return true;
  }

  async createUserProfile(
    profileDto: UserProfileDto,
  ): Promise<ProfileDocument> {
    let result = null;
    try {
      const validate = new ValidateDto();
      const option = { user: profileDto.user };
      await validate.existedByOptions(
        collections.profiles,
        option,
        'User profile',
      );
      result = await new this.profileSchema(profileDto).save();
    } catch (error) {
      await this.userSchema.findByIdAndDelete(profileDto.user);
      console.log(error);
      new CommonException(500, msgServerError);
    }
    return result;
  }

  async createLeaderSchool(
    leaderDto: CreateLeaderSchoolDto,
    createdBy: string,
  ): Promise<Leader_Schools> {
    const { user } = leaderDto;
    const validate = new ValidateDto();
    await validate.fieldId(collections.profiles, user);
    const option = { user: new Types.ObjectId(user) };
    await validate.existedByOptions(
      collections.leader_schools,
      option,
      'Leader school',
    );
    const dto = {
      ...leaderDto,
      createdBy,
    };
    const createLeaderSchool = await new this.leaderSchoolSchema(dto).save();
    const result = await this.findLeaderSchoolById(createLeaderSchool._id);
    return result;
  }

  async findLeaderSchoolById(id: string): Promise<Leader_Schools> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = new LookupService().profile();
    const aggregate = [match, ...lookup];
    const result = await this.leaderSchoolSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async updateLeaderSchool(
    id: string,
    updateLeaderDto: UpdateLeaderSchoolDto,
    updatedBy: string,
  ): Promise<Leader_Schools> {
    const dto = {
      ...updateLeaderDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.leaderSchoolSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAllLeaderSchool(
    queryDto: QueryLeaderSchoolDto,
  ): Promise<Leader_Schools[]> {
    const { user } = queryDto;
    const match: ImatchFindLeaderSchool = { $match: { isDeleted: false } };
    if (user) {
      match.$match.user = new Types.ObjectId(user);
    }
    const lookup = new LookupService().profile();
    const aggregate = [match, ...lookup];
    const results = await this.leaderSchoolSchema.aggregate(aggregate);
    return results;
  }

  async deleteLeaderSchool(id: string, deletedBy: string): Promise<void> {
    const dto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.leaderSchoolSchema.findByIdAndUpdate(id, dto);
  }

  async deleteUser(id: string, deletedBy: string): Promise<void> {
    const dto = {
      deletedBy,
      status: EstatusUser.INACTIVE,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.userSchema.findByIdAndUpdate(id, dto);
    await this.profileSchema.findOneAndUpdate(
      { user: new Types.ObjectId(id) },
      dto,
    );
  }
}
