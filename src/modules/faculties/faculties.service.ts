import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { UpdateFacultyDto } from './dtos/faculties.update.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    private readonly validate: ValidateField,
  ) {}

  async validateFaculty(facultyDto: Record<string, any>): Promise<void> {
    const { headOfSection, eputeHead, award = [] } = facultyDto;
    if (award.length > 0) {
      for (const item of award) {
        await this.validate.byId(this.awardSchema, item, `Award ${item}`);
      }
    }
    if (headOfSection) {
      await this.validate.byId(
        this.profileSchema,
        headOfSection,
        'headOfSection rofile',
      );
    }
    if (eputeHead) {
      await this.validate.byId(
        this.profileSchema,
        eputeHead,
        'eputeHead profile',
      );
    }
  }

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const option = { name: createFacultyDto.name };
    await this.validateFaculty(createFacultyDto);
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
    await this.validateFaculty(facultyDto);
    await this.facultySchema.findByIdAndUpdate(id, facultyDto);
    const result = await this.findFacultyById(id);
    return result;
  }

  async findAllFaculties(facultyQueryDto: FacultyQueryDto): Promise<Faculty[]> {
    const { searchKey, branch } = facultyQueryDto;
    const query: Record<string, any> = {};
    if (searchKey) {
      query.name = new RegExp(searchKey);
    }
    if (branch) {
      query.branch = new Types.ObjectId(branch);
    }
    const results = await this.facultySchema
      .find(query)
      .populate('award', '', this.awardSchema)
      .populate('headOfSection', '', this.profileSchema)
      .populate('eputeHead', '', this.profileSchema)
      .exec();
    return results;
  }
}
