import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { UpdateFacultyDto } from './dtos/faculties.update.dto';
import { CreateMajorDto } from './dtos/faculties.major.create.dto';
import { MajorQueryDto } from './dtos/faculties.major.query.dto';
import { UpdateMajorDto } from './dtos/faculties.major.update.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';
import { Majors, MajorsDocument } from './schemas/faculties.major.schema';
import {
  IqueryFaculty,
  IqueryMajor,
} from './interfaces/faculties.find.interface';
import {
  facultiesMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  selectAward,
  selectFaculty,
  selectUser,
} from 'src/utils/utils.populate';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
  ) {}

  async createFaculty(
    createFacultyDto: CreateFacultyDto,
    createdBy: string,
  ): Promise<Faculty> {
    const { name } = createFacultyDto;
    await this.validateDto(createFacultyDto);
    const existed = await this.facultySchema.findOne({ name: name?.trim() });
    if (existed) {
      new CommonException(409, facultiesMsg.existedName);
    }
    const result = await new this.facultySchema({
      ...createFacultyDto,
      createdBy,
    }).save();
    return result;
  }

  async findFacultyById(id: string): Promise<Faculty> {
    const result = await this.facultySchema
      .findById(id)
      .populate('headOfSection', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('eputeHead', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('award', selectAward, this.awardSchema, { isDeleted: false })
      .exec();
    if (!result) {
      new CommonException(404, facultiesMsg.notFound);
    }
    return result;
  }

  async updateFaculty(
    id: string,
    facultyDto: UpdateFacultyDto,
    updatedBy: string,
  ): Promise<Faculty> {
    await this.validateDto(facultyDto);
    const updateDto = {
      ...facultyDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.facultySchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return result;
  }

  async findAllFaculties(
    facultyQueryDto: FacultyQueryDto,
  ): Promise<{ results: Faculty[]; total: number }> {
    const { limit, page, searchKey, type } = facultyQueryDto;
    const query: IqueryFaculty = { isDeleted: false };
    if (type) {
      query.type = type;
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.facultySchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('headOfSection', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('eputeHead', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('award', selectAward, this.awardSchema, { isDeleted: false })
      .exec();
    const total = await this.facultySchema.find(query).count();
    return { results, total };
  }

  async createMajor(
    majorDto: CreateMajorDto,
    createdBy: string,
  ): Promise<Majors> {
    const { faculty } = majorDto;
    const facultyInfo = await this.facultySchema.findOne({
      _id: new Types.ObjectId(faculty),
      isDeleted: false,
    });
    if (!facultyInfo) {
      new CommonException(404, facultiesMsg.notFound);
    }
    await this.validateDto(majorDto);
    const result = await new this.majorSchema({
      ...majorDto,
      createdBy,
    }).save();
    return result;
  }

  async findMajorById(id: string): Promise<Majors> {
    const result = await this.majorSchema
      .findById(id)
      .populate('faculty', selectFaculty, this.facultySchema, {
        isDeleted: false,
      })
      .populate('headOfSection', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('eputeHead', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('award', selectAward, this.awardSchema, { isDeleted: false })
      .exec();
    if (!result) {
      new CommonException(404, facultiesMsg.notFoundMajor);
    }
    return result;
  }

  async updateMajor(
    id: string,
    majorDto: UpdateMajorDto,
    updatedBy: string,
  ): Promise<Majors> {
    const { faculty } = majorDto;
    if (faculty) {
      const facultyInfo = await this.facultySchema.findOne({
        _id: new Types.ObjectId(faculty),
        isDeleted: false,
      });
      if (!facultyInfo) {
        new CommonException(404, facultiesMsg.notFound);
      }
    }
    const updateDto = {
      ...majorDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.majorSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    return result;
  }

  async findAllMajors(
    queryDto: MajorQueryDto,
  ): Promise<{ results: Majors[]; total: number }> {
    const { faculty, searchKey } = queryDto;
    const query: IqueryMajor = { isDeleted: false };
    if (faculty) {
      query.faculty = new Types.ObjectId(faculty);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.majorSchema
      .find(query)
      .populate('faculty', selectFaculty, this.facultySchema, {
        isDeleted: false,
      })
      .populate('headOfSection', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('eputeHead', selectUser, this.profileSchema, {
        isDeleted: false,
      })
      .populate('award', selectAward, this.awardSchema, { isDeleted: false })
      .exec();
    const total = await this.majorSchema.find(query).count();
    return { results, total };
  }

  async validateDto(facultyDto: CreateFacultyDto): Promise<void> {
    const { award = [], headOfSection, eputeHead } = facultyDto;
    const valid = new ValidFields();
    if (headOfSection) {
      await valid.id(
        this.profileSchema,
        headOfSection,
        userMsg.notFoundProfile,
      );
    }
    if (eputeHead) {
      await valid.id(this.profileSchema, eputeHead, userMsg.notFoundProfile);
    }
    if (award.length > 0) {
      const awardIds = await valid.idList(this.awardSchema, award);
      facultyDto.award = awardIds;
    }
  }
}
