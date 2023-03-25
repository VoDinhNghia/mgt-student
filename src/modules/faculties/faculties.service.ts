import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupService } from 'src/utils/lookup.query.service';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateFacultyDto } from './dtos/faculties.create.dto';
import { FacultyQueryDto } from './dtos/faculties.query.dto';
import { UpdateFacultyDto } from './dtos/faculties.update.dto';
import { CreateMajorDto } from './dtos/faculties.major.create.dto';
import { MajorQueryDto } from './dtos/faculties.major.query.dto';
import { UpdateMajorDto } from './dtos/faculties.major.update.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';
import { Majors, MajorsDocument } from './schemas/faculties.major.schema';
import { ImatchFindFaculty } from './interfaces/faculties.match.find';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
  ) {}

  async createFaculty(
    createFacultyDto: CreateFacultyDto,
    createdBy: string,
  ): Promise<Faculty> {
    const { name, award = [] } = createFacultyDto;
    const validate = new ValidateDto();
    const option = { name: name?.trim() };
    await new ValidateDto().faculty(createFacultyDto);
    if (award.length > 0) {
      const awardIds = await validate.idLists(collections.awards, award);
      createFacultyDto.award = awardIds;
    }
    await validate.existedByOptions(collections.faculties, option, 'Faculty');
    const faculty = await new this.facultySchema({
      ...createFacultyDto,
      createdBy,
    }).save();
    const result = await this.findFacultyById(faculty._id);
    return result;
  }

  async findFacultyById(id: string): Promise<Faculty> {
    const match: ImatchFindFaculty = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = new LookupService().faculty();
    const aggregate = [match, ...lookup];
    const result = await this.facultySchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async updateFaculty(
    id: string,
    facultyDto: UpdateFacultyDto,
    updatedBy,
  ): Promise<Faculty> {
    await new ValidateDto().faculty(facultyDto);
    const dto = {
      ...facultyDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.facultySchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAllFaculties(facultyQueryDto: FacultyQueryDto): Promise<Faculty[]> {
    const { searchKey } = facultyQueryDto;
    const match: ImatchFindFaculty = { $match: { isDeleted: false } };
    if (searchKey) {
      match.$match.name = new RegExp(searchKey);
    }
    const lookup = new LookupService().faculty();
    const aggregate = [match, ...lookup];
    const results = await this.facultySchema.aggregate(aggregate);
    return results;
  }

  async createMajor(
    majorDto: CreateMajorDto,
    createdBy: string,
  ): Promise<Majors> {
    await new ValidateDto().faculty(majorDto);
    const major = await new this.majorSchema({ ...majorDto, createdBy }).save();
    const result = await this.findMajorById(major._id);
    return result;
  }

  async findMajorById(id: string): Promise<Majors> {
    const match: ImatchFindFaculty = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = new LookupService().major();
    const aggregate = [match, ...lookup];
    const result = await this.majorSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async updateMajor(
    id: string,
    majorDto: UpdateMajorDto,
    updatedBy: string,
  ): Promise<Majors> {
    await new ValidateDto().faculty(majorDto);
    const dto = {
      ...majorDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.majorSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findAllMajors(queryDto: MajorQueryDto): Promise<Majors[]> {
    const { faculty } = queryDto;
    const match: ImatchFindFaculty = { $match: { isDeleted: false } };
    if (faculty) {
      match.$match.faculty = new Types.ObjectId(faculty);
    }
    const lookup = new LookupService().major();
    const aggregate = [match, ...lookup];
    const results = await this.majorSchema.aggregate(aggregate);
    return results;
  }
}
