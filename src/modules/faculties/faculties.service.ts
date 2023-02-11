import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Award, AwardDocument } from '../awards/schemas/awards.schema';
import { Branch, BranchDocument } from '../branch/schemas/branch.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Branch.name)
    private readonly branchSchema: Model<BranchDocument>,
    @InjectModel(Award.name)
    private readonly awardSchema: Model<AwardDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    private readonly validateField: ValidateField,
  ) {}

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const { branch } = createFacultyDto;
    await this.validateField.byId(this.branchSchema, branch, 'Branch');
    const option = { name: createFacultyDto.name };
    await this.validateField.existed(this.facultySchema, option, 'Faculty');
    const result = await new this.facultySchema(createFacultyDto).save();
    return result;
  }

  async findOneFaculty(options: Record<string, any>): Promise<Faculty> {
    const result = await this.facultySchema
      .findOne(options)
      .populate('branch', '', this.branchSchema)
      .populate('award', '', this.awardSchema)
      .populate('lecturerList.lecturer', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Faculty not found.');
    }
    return result;
  }

  async findFacultyById(id: string): Promise<Faculty> {
    const result = await this.facultySchema
      .findById(id)
      .populate('branch', '', this.branchSchema)
      .populate('award', '', this.awardSchema)
      .populate('lecturerList.lecturer', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Faculty not found.');
    }
    return result;
  }

  async findAllFaculties(facultyQueryDto: FacultyQueryDto): Promise<Faculty[]> {
    const { limit, page, searchKey, branch } = facultyQueryDto;

    const results = await this.facultySchema.find({});
    return results;
  }
}
