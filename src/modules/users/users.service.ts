import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/users.create.dto';
import { Users, UsersDocument } from './schemas/users.schema';
import { Profile, ProfileDocument } from './schemas/users.profile.schema';
import { cryptoPassWord } from 'src/constants/constants.crypto';
import {
  EstatusUserProfile,
  ErolesUser,
  EstatusUser,
  passwordDefault,
} from 'src/constants/constant';
import { UsersFillterDto } from './dto/users.query.dto';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import {
  LeaderSchools,
  LeaderSchoolDocument,
} from './schemas/users.leader-school.schema';
import { CreateLeaderSchoolDto } from './dto/users.create.leader-school.dto';
import { QueryLeaderSchoolDto } from './dto/users.query.leader-school.dto';
import { UpdateLeaderSchoolDto } from './dto/users.update.leader-school.dto';
import { GenerateCode } from 'src/utils/utils.generate.code';
import {
  StudyProcesses,
  StudyProcessDocument,
} from '../study-process/schemas/study-process.schema';
import { InitSuperAdminDto } from '../auth/dtos/auth.init-super-admin.dto';
import { UsersUpdateDto } from './dto/users.update.dto';
import {
  userMsg,
  msgServerError,
  facultiesMsg,
  courseMsg,
  degreeLevelMsg,
  classMsg,
  msgEmailExisted,
} from 'src/constants/constants.message.response';
import {
  ImatchFindAllUser,
  IqueryLeaderSchool,
} from './interfaces/users.find.match.interface';
import { UserProfileDto } from './dto/users.create-profile.dto';
import { UpdateProfileDto } from './dto/users.update.profile.dto';
import { userLookup } from 'src/utils/utils.lookup.query.service';
import { skipLimitAndSortPagination } from 'src/utils/utils.page.pagination';
import { IusersImport } from './interfaces/users.import.interface';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import {
  Faculty,
  FacultyDocument,
} from '../faculties/schemas/faculties.schema';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from '../degreelevels/schemas/degreelevels.schema';
import {
  Majors,
  MajorsDocument,
} from '../faculties/schemas/faculties.major.schema';
import {
  ClassInfos,
  ClassInfosDocument,
} from '../class-subject/schemas/class-subject.class.schema';
import { Course, CourseDocument } from '../courses/schemas/courses.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class UsersService {
  private populateUser: string = 'user';
  private generateCode: string = new GenerateCode().getRandomCodeProfile(5);

  constructor(
    @InjectModel(Users.name) private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(LeaderSchools.name)
    private readonly leaderSchoolSchema: Model<LeaderSchoolDocument>,
    @InjectModel(StudyProcesses.name)
    private readonly studyProcessSchema: Model<StudyProcessDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
    @InjectModel(ClassInfos.name)
    private readonly classInfoSchema: Model<ClassInfosDocument>,
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
  ) {}

  public async createUser(
    usersDto: CreateUserDto,
    createdBy: string,
  ): Promise<Users> {
    const { email } = usersDto;
    await this.validateEmail(email);
    usersDto.passWord = cryptoPassWord(usersDto.passWord);
    const newDto = {
      ...usersDto,
      createdBy,
    };
    const user = await new this.userSchema(newDto).save();
    const profileDto = {
      ...usersDto,
      user: user._id,
      code: this.generateCode,
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
        new CommonException(
          HttpStatusCode.SERVER_INTERVAL,
          userMsg.createUserProcessFailed,
        );
      }
    }
    const result = this.findUserById(user._id);

    return result;
  }

  public async createStudyProcess(
    userId: string,
    profileId: string,
    createdBy: string,
  ): Promise<boolean> {
    try {
      const studyProcessDto = {
        user: profileId,
        status: EstatusUserProfile.STUDYING,
        createdBy,
      };
      await new this.studyProcessSchema(studyProcessDto).save();
      return true;
    } catch (error) {
      await this.userSchema.findByIdAndDelete(userId);
      await this.profileSchema.findByIdAndDelete(profileId);
      return false;
    }
  }

  public async findUserById(id: string): Promise<Users> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = userLookup();
    const aggregate = [match, ...lookup, { $limit: 1 }];
    const result = await this.userSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(HttpStatusCode.NOT_FOUND, userMsg.notFoundUser);
    }

    return result[0];
  }

  public async findAllUsers(
    query: UsersFillterDto,
    userId: string,
  ): Promise<{ results: Users[]; total: number }> {
    const { searchKey, limit, page, role, status } = query;
    const match: ImatchFindAllUser = {
      $match: {
        _id: { $ne: new Types.ObjectId(userId) },
        isDeleted: false,
        role: { $ne: ErolesUser.SUPPER_ADMIN },
      },
    };
    if (role) {
      match.$match.role = role;
    }
    if (status) {
      match.$match.status = status;
    }
    const lookup = userLookup();
    let aggregate = [match, ...lookup];
    if (searchKey) {
      aggregate = [
        ...aggregate,
        {
          $match: {
            $or: [
              {
                'profile.firstName': new RegExp(searchKey, 'i'),
              },
              {
                'profile.lastName': new RegExp(searchKey, 'i'),
              },
              {
                'profile.middleName': new RegExp(searchKey, 'i'),
              },
            ],
          },
        },
      ];
    }
    const pagination = skipLimitAndSortPagination(limit, page);
    const results = await this.userSchema.aggregate([
      ...aggregate,
      ...pagination,
    ]);
    const total = await this.userSchema.aggregate([
      ...aggregate,
      { $count: 'total' },
    ]);

    return {
      results,
      total: total[0]?.total ?? 0,
    };
  }

  public async updateUser(
    id: string,
    payload: UsersUpdateDto,
    updatedBy: string,
  ): Promise<Users> {
    const { passWord, email, newPassword } = payload;
    if (email) {
      await this.validateEmail(email);
    }
    if (passWord && newPassword) {
      const currentPassword = cryptoPassWord(passWord);
      const newPass = cryptoPassWord(newPassword);
      const checkUserPassword = await this.userSchema.findOne({
        id: new Types.ObjectId(id),
        passWord: currentPassword,
      });
      if (!checkUserPassword) {
        new CommonException(
          HttpStatusCode.BAD_REQUEST,
          userMsg.passwordIncorect,
        );
      }
      payload.passWord = newPass;
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

  public async updateUserProfile(
    id: string,
    profileDto: UpdateProfileDto,
    updatedBy: string,
  ): Promise<Profile> {
    const {
      major,
      faculty,
      course,
      degreeLevel,
      classId,
      award = [],
    } = profileDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, id, userMsg.notFoundProfile);
    if (award.length > 0) {
      const ids = await valid.idList(this.awardSchema, award);
      profileDto.award = ids;
    }
    if (major) {
      await valid.id(this.majorSchema, major, facultiesMsg.notFoundMajor);
    }
    if (faculty) {
      await valid.id(this.facultySchema, faculty, facultiesMsg.notFound);
    }
    if (course) {
      await valid.id(this.courseSchema, course, courseMsg.notFound);
    }
    if (degreeLevel) {
      await valid.id(
        this.degreeLevelSchema,
        degreeLevel,
        degreeLevelMsg.notFound,
      );
    }
    if (classId) {
      await valid.id(this.classInfoSchema, classId, classMsg.notFoud);
    }
    const updateProfileDto = {
      ...profileDto,
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

  public async importUser(
    createdBy: string,
    data: IusersImport[],
  ): Promise<IusersImport[]> {
    for await (const item of data) {
      const { email, passWord, role, firstName, lastName } = item;
      if (!email || !passWord || !role || !firstName || !lastName) {
        item.statusImport = userMsg.importValidate;
        continue;
      }
      await this.validateEmail(email);
      let user = null;
      let profile = null;
      try {
        const userDto = {
          ...item,
          passWord: cryptoPassWord(passWord || passwordDefault),
          createdBy,
        };
        user = await new this.userSchema(userDto).save();
      } catch {
        item.statusImport = userMsg.importCreateUserFailed;
        continue;
      }
      const existedProfile = await this.profileSchema.findOne({
        user: user._id,
      });
      if (existedProfile || !user) {
        item.statusImport = userMsg.importCreateProfileFailed;
        continue;
      }
      try {
        const profileDto = {
          ...item,
          user: user._id,
          code: this.generateCode,
          createdBy,
        };
        profile = await new this.profileSchema(profileDto).save();
      } catch {
        item.statusImport = userMsg.importCreateProfileFailed;
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
          item.statusImport = userMsg.importCreateStudyProcessFailed;
          continue;
        }
      }
      item.statusImport = userMsg.importStatus;
    }

    return data;
  }

  public async initSupperAdmin(
    superAdminDto: InitSuperAdminDto,
  ): Promise<Users> {
    const { email, passWord, firstName, lastName } = superAdminDto;
    const option = { role: ErolesUser.SUPPER_ADMIN };
    const existedRoleSa = await this.userSchema.findOne(option);
    if (existedRoleSa) {
      new CommonException(HttpStatusCode.CONFLICT, userMsg.supperAdminExisted);
    }
    const supperAdminDto = {
      email,
      passWord: cryptoPassWord(passWord || passwordDefault),
      status: EstatusUser.ACTIVE,
      statusLogin: false,
      role: ErolesUser.SUPPER_ADMIN,
    };
    const supperAdmin = await new this.userSchema(supperAdminDto).save();
    const profileSuperAdmin = {
      firstName,
      lastName,
      user: supperAdmin._id,
      code: `SA_${this.generateCode}`,
    };
    await this.createUserProfile(profileSuperAdmin);
    const result = await this.findUserById(supperAdmin._id);

    return result;
  }

  public async createUserProfile(
    profileDto: UserProfileDto,
  ): Promise<ProfileDocument> {
    let result = null;
    try {
      const option = { user: profileDto.user };
      const existedProfile = await this.profileSchema.findOne(option);
      if (existedProfile) {
        new CommonException(
          HttpStatusCode.CONFLICT,
          userMsg.profileUserExisted,
        );
      }
      result = await new this.profileSchema(profileDto).save();
    } catch (error) {
      await this.userSchema.findByIdAndDelete(profileDto.user);
      console.log(error);
      new CommonException(HttpStatusCode.SERVER_INTERVAL, msgServerError);
    }

    return result;
  }

  public async createLeaderSchool(
    leaderDto: CreateLeaderSchoolDto,
    createdBy: string,
  ): Promise<LeaderSchools> {
    const { user } = leaderDto;
    const userProfile = await this.profileSchema.findById(user);
    if (!userProfile) {
      new CommonException(HttpStatusCode.NOT_FOUND, userMsg.notFoundProfile);
    }
    const option = { user: new Types.ObjectId(user) };
    const existedLeader = await this.leaderSchoolSchema.findOne(option);
    if (existedLeader) {
      new CommonException(HttpStatusCode.CONFLICT, userMsg.leaderSchoolExisted);
    }
    const dto = {
      ...leaderDto,
      createdBy,
    };
    const createLeaderSchool = await new this.leaderSchoolSchema(dto).save();
    const result = await this.findLeaderSchoolById(createLeaderSchool._id);

    return result;
  }

  public async findLeaderSchoolById(id: string): Promise<LeaderSchools> {
    const result = await this.leaderSchoolSchema
      .findById(id)
      .populate(this.populateUser, '', this.profileSchema, { isDeleted: false })
      .exec();
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        userMsg.notFoundeaderSchool,
      );
    }

    return result;
  }

  public async updateLeaderSchool(
    id: string,
    updateLeaderDto: UpdateLeaderSchoolDto,
    updatedBy: string,
  ): Promise<LeaderSchools> {
    await this.findLeaderSchoolById(id);
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

  public async findAllLeaderSchool(
    queryDto: QueryLeaderSchoolDto,
  ): Promise<{ results: LeaderSchools[]; total: number }> {
    const { user, limit, page } = queryDto;
    const query: IqueryLeaderSchool = { isDeleted: false };
    if (user) {
      query.user = new Types.ObjectId(user);
    }
    const results = await this.leaderSchoolSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateUser, '', this.profileSchema, { isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.leaderSchoolSchema.find(query).count();

    return {
      results,
      total,
    };
  }

  public async deleteLeaderSchool(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    await this.findLeaderSchoolById(id);
    const dto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.leaderSchoolSchema.findByIdAndUpdate(id, dto);
  }

  public async deleteUser(id: string, deletedBy: string): Promise<void> {
    await this.findUserById(id);
    const dto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.userSchema.findByIdAndUpdate(id, dto);
    const profile = await this.profileSchema.findOneAndUpdate(
      { user: new Types.ObjectId(id) },
      dto,
    );
    await this.studyProcessSchema.findOneAndUpdate({ user: profile._id }, dto);
  }

  private async validateEmail(email: string): Promise<void> {
    const result = await this.userSchema.findOne({ email });
    if (result) {
      new CommonException(HttpStatusCode.CONFLICT, msgEmailExisted);
    }
  }
}
