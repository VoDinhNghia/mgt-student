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
import { UsersFillterDto } from './dto/user.filter.dto';
import { validateEmail } from 'src/validates/validate.email';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { Pagination } from 'src/utils/page.pagination';
import { UpdateProfileDto } from './dto/user.update-profile.dto';
import {
  Leader_Schools,
  LeaderSchoolDocument,
} from './schemas/users.leader-school.schema';
import { CreateLeaderSchoolDto } from './dto/user.create.leader-school.dto';
import { QueryLeaderSchoolDto } from './dto/user.query.leader-school.dto';
import { UpdateLeaderSchoolDto } from './dto/user.update.leader-school.dto';
import { getRandomCode } from 'src/utils/generate.code-profile';
import {
  Study_Processes,
  StudyProcessDocument,
} from './schemas/study-process.schema';
import { CreateStudyProcessDto } from './dto/study-process.create.dto';
import { InitSuperAdminDto } from '../auth/dtos/auth.init-super-admin.dto';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { UsersUpdateDto } from './dto/user.update.dto';

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

  async createUser(
    usersDto: CreateUserDto,
    createdBy: string,
  ): Promise<Users | any> {
    const { email } = usersDto;
    await this.validateEmailUser(email);
    await this.validateProfileDto(usersDto);
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

  async findUserById(id: string | any): Promise<Users | any> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = this.lookupUser();
    const aggregate = [match, ...lookup];
    const result = await this.userSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'User not found.');
    }
    return result[0];
  }

  async findAllUsers(query: UsersFillterDto, userId: string): Promise<Users[]> {
    const { searchKey, limit, page, role, status } = query;
    const match: Record<string, any> = {
      $match: { _id: { $ne: new Types.ObjectId(userId) }, isDeleted: false },
    };
    if (role) {
      match.$match.role = role;
    }
    if (status) {
      match.$match.status = status;
    }
    const lookup = this.lookupUser();
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
    const aggPagination: any = new Pagination(limit, page, aggregate);
    const result = await this.userSchema.aggregate(aggPagination);
    return result;
  }

  async updateUser(
    id: string,
    payload: UsersUpdateDto,
    updatedBy: string,
  ): Promise<Users> {
    const { email, passWord } = payload;
    if (email) {
      await this.validateEmailUser(email);
    }
    if (passWord) {
      payload.passWord = cryptoPassWord(passWord);
    }
    const updateInfo = {
      ...payload,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.userSchema.findByIdAndUpdate(id, updateInfo);
    const result = await this.findUserById(id);
    return result;
  }

  async updateUserProfile(
    id: string,
    profileDto: UpdateProfileDto,
    updatedBy: string,
  ): Promise<Profile | any> {
    const { award = [] } = profileDto;
    await this.validateProfileDto(profileDto);
    if (award.length > 0) {
      const awardIds = await new ValidateDto().idLists('awards', award);
      profileDto.award = awardIds;
    }
    const updateProfileDto = {
      ...profileDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const profile = await this.profileSchema.findByIdAndUpdate(
      id,
      updateProfileDto,
    );
    const result = await this.findUserById(profile.user);
    return result;
  }

  async importUser(createdBy: string, data = []) {
    for (const item of data) {
      const { email, passWord, role, firstName, lastName } = item;
      if (!email || !passWord || !role || !firstName || !lastName) {
        item.statusImport =
          'email || passWord || role || firstName || lastName must provided.';
        continue;
      }
      let user = null;
      let profile = null;
      if (!validateEmail(email)) {
        item.statusImport = 'Email incorect format.';
        continue;
      }
      const existedEmail = await this.userSchema.findOne({ email });
      if (existedEmail) {
        item.statusImport = 'Email existed already.';
        continue;
      }
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
    await this.validateEmailUser(email);
    const option = { role: ErolesUser.SUPPER_ADMIN };
    await new ValidateDto().existedByOptions('users', option, 'Supper Admin');
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
    profileDto: Record<string, any>,
  ): Promise<Profile | any> {
    try {
      const validate = new ValidateDto();
      const option = { user: profileDto.user };
      await validate.existedByOptions('profiles', option, 'User profile');
      const result = await new this.profileSchema(profileDto).save();
      return result;
    } catch (error) {
      await this.userSchema.findByIdAndDelete(profileDto.user);
      console.log(error);
      new CommonException(500, `Server interval.`);
    }
  }

  async createLeaderSchool(
    leaderDto: CreateLeaderSchoolDto,
    createdBy: string,
  ): Promise<Leader_Schools> {
    const { user } = leaderDto;
    const validate = new ValidateDto();
    await validate.fieldId('profiles', user);
    const option = { user: new Types.ObjectId(user) };
    await validate.existedByOptions('leaderschools', option, 'Leader school');
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
    const lookup = this.lookupProfile();
    const aggregate = [match, ...lookup];
    const result = await this.leaderSchoolSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Leader school not found.');
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
    await this.leaderSchoolSchema.findByIdAndUpdate(id, dto);
    const result = await this.findLeaderSchoolById(id);
    return result;
  }

  async findAllLeaderSchool(
    queryDto: QueryLeaderSchoolDto,
  ): Promise<Leader_Schools[]> {
    const { user } = queryDto;
    const match: Record<string, any> = { $match: { isDeleted: false } };
    if (user) {
      match.$match.user = new Types.ObjectId(user);
    }
    const lookup = this.lookupProfile();
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

  async validateEmailUser(email: string): Promise<void> {
    if (!validateEmail(email)) {
      new CommonException(400, `Email not correct format.`);
    }
    await new ValidateDto().existedByOptions('users', { email }, 'Email');
  }

  async validateProfileDto(fields: Record<string, any>): Promise<void> {
    const validate = new ValidateDto();
    const { major, faculty, course, degreeLevel, classId } = fields;
    if (major) {
      await validate.fieldId('majors', major);
    }
    if (faculty) {
      await validate.fieldId('faculties', faculty);
    }
    if (course) {
      await validate.fieldId('courses', course);
    }
    if (degreeLevel) {
      await validate.fieldId('degreelevels', degreeLevel);
    }
    if (classId) {
      await validate.fieldId('class_infos', classId);
    }
  }

  private lookupUser() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: '_id',
        foreignField: 'user',
        as: 'profile',
        unwind: true,
      },
    ]);
    return lookup;
  }

  private lookupProfile() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'user',
        foreignField: '_id',
        as: 'profile',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
