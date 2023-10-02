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
  selectProfile,
} from 'src/utils/utils.populate';
import { HttpStatusCode } from 'src/constants/constants.http-status';
import { deleteBody } from 'src/utils/utils.delete-body';

@Injectable()
export class FacultiesService {
  private populateHeadOfSection: string = 'headOfSection';
  private populateEputeHead: string = 'eputeHead';
  private populateAward: string = 'award';
  private populateFaculty: string = 'faculty';

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

  public async createFaculty(
    createFacultyDto: CreateFacultyDto,
    createdBy: string,
  ): Promise<Faculty> {
    const { name } = createFacultyDto;
    await this.validateDto(createFacultyDto);
    const existed = await this.facultySchema.findOne({ name: name?.trim() });
    if (existed) {
      new CommonException(HttpStatusCode.CONFLICT, facultiesMsg.existedName);
    }
    const result = await new this.facultySchema({
      ...createFacultyDto,
      createdBy,
    }).save();

    return result;
  }

  public async findFacultyById(id: string): Promise<Faculty> {
    const result = await this.facultySchema
      .findById(id)
      .populate(this.populateHeadOfSection, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateEputeHead, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, selectAward, this.awardSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, facultiesMsg.notFound);
    }

    return result;
  }

  public async updateFaculty(
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

  public async findAllFaculties(
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
      .populate(this.populateHeadOfSection, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateEputeHead, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, selectAward, this.awardSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.facultySchema.find(query).count();

    return { results, total };
  }

  public async createMajor(
    majorDto: CreateMajorDto,
    createdBy: string,
  ): Promise<Majors> {
    const { faculty } = majorDto;
    const facultyInfo = await this.facultySchema.findOne({
      _id: new Types.ObjectId(faculty),
      isDeleted: false,
    });
    if (!facultyInfo) {
      new CommonException(HttpStatusCode.NOT_FOUND, facultiesMsg.notFound);
    }
    await this.validateDto(majorDto);
    const result = await new this.majorSchema({
      ...majorDto,
      createdBy,
    }).save();

    return result;
  }

  public async findMajorById(id: string): Promise<Majors> {
    const result = await this.majorSchema
      .findById(id)
      .populate(this.populateFaculty, selectFaculty, this.facultySchema, {
        isDeleted: false,
      })
      .populate(this.populateHeadOfSection, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateEputeHead, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, selectAward, this.awardSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, facultiesMsg.notFoundMajor);
    }

    return result;
  }

  public async updateMajor(
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
        new CommonException(HttpStatusCode.NOT_FOUND, facultiesMsg.notFound);
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

  public async findAllMajors(
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
      .populate(this.populateFaculty, selectFaculty, this.facultySchema, {
        isDeleted: false,
      })
      .populate(this.populateHeadOfSection, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateEputeHead, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateAward, selectAward, this.awardSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.majorSchema.find(query).count();

    return { results, total };
  }

  public async deleteFaculty(id: string, deletedBy: string): Promise<void> {
    await this.findFacultyById(id);
    const body = deleteBody();
    await this.facultySchema.findByIdAndUpdate(id, { ...body, deletedBy });
  }

  public async deleteMajor(id: string, deletedBy: string): Promise<void> {
    await this.findMajorById(id);
    const body = deleteBody();
    await this.majorSchema.findByIdAndUpdate(id, { ...body, deletedBy });
  }

  private async validateDto(facultyDto: CreateFacultyDto): Promise<void> {
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
