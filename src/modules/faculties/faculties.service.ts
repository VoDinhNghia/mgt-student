import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { ValidateField } from 'src/validates/validate.field-id.dto';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { UpdateFacultyDto } from './dtos/faculties.update.dto';
import { CreateMajorDto } from './dtos/major.create.dto';
import { MajorQueryDto } from './dtos/major.query.dto';
import { UpdateMajorDto } from './dtos/major.update.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';
import { Majors, MajorsDocument } from './schemas/major.schema';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
    private readonly validate: ValidateField,
  ) {}

  async validateCommon(facultyDto: Record<string, any>): Promise<void> {
    const { headOfSection, eputeHead, award = [], faculty } = facultyDto;
    if (award.length > 0) {
      for (const item of award) {
        await this.validate.byId(this.awardSchema, item, `Award ${item}`);
      }
    }
    if (headOfSection) {
      await this.validate.byId(
        this.profileSchema,
        headOfSection,
        'headOfSection profile',
      );
    }
    if (eputeHead) {
      await this.validate.byId(
        this.profileSchema,
        eputeHead,
        'eputeHead profile',
      );
    }
    if (faculty) {
      await this.validate.byId(this.facultySchema, faculty, 'Faculty');
    }
  }

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const option = { name: createFacultyDto.name };
    await this.validateCommon(createFacultyDto);
    await this.validate.existed(this.facultySchema, option, 'Faculty');
    const faculty = await new this.facultySchema(createFacultyDto).save();
    const result = await this.findFacultyById(faculty._id);
    return result;
  }

  async findFacultyById(id: string): Promise<Faculty> {
    const result = await this.facultySchema
      .findById(id)
      .populate('award', '', this.awardSchema)
      .populate('headOfSection', '', this.profileSchema)
      .populate('eputeHead', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Faculty not found.');
    }
    return result;
  }

  async updateFaculty(
    id: string,
    facultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    await this.validateCommon(facultyDto);
    await this.facultySchema.findByIdAndUpdate(id, facultyDto);
    const result = await this.findFacultyById(id);
    return result;
  }

  async findAllFaculties(facultyQueryDto: FacultyQueryDto): Promise<Faculty[]> {
    const { searchKey } = facultyQueryDto;
    const query: Record<string, any> = {};
    if (searchKey) {
      query.name = new RegExp(searchKey);
    }
    const results = await this.facultySchema
      .find(query)
      .populate('award', '', this.awardSchema)
      .populate('headOfSection', '', this.profileSchema)
      .populate('eputeHead', '', this.profileSchema)
      .exec();
    return results;
  }

  async createMajor(majorDto: CreateMajorDto): Promise<Majors> {
    await this.validateCommon(majorDto);
    const major = await new this.majorSchema(majorDto).save();
    const result = await this.findMajorById(major._id);
    return result;
  }

  async findMajorById(id: string): Promise<Majors> {
    const result = await this.majorSchema
      .findById(id)
      .populate('faculty', '', this.facultySchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Major not found.');
    }
    return result;
  }

  async updateMajor(id: string, majorDto: UpdateMajorDto): Promise<Majors> {
    await this.validateCommon(majorDto);
    await this.majorSchema.findByIdAndUpdate(id, majorDto);
    const result = await this.findMajorById(id);
    return result;
  }

  async findAllMajors(queryDto: MajorQueryDto): Promise<Majors[]> {
    const { faculty } = queryDto;
    const query: Record<string, any> = {};
    if (faculty) {
      query.faculty = new Types.ObjectId(faculty);
    }
    const results = await this.majorSchema
      .find(query)
      .populate('faculty', '', this.facultySchema)
      .exec();
    return results;
  }
}
