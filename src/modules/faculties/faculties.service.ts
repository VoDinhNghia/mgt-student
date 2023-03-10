import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';
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
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
  ) {}

  async validateDto(dtos: Record<string, any>): Promise<void> {
    const { headOfSection, eputeHead, faculty } = dtos;
    const validate = new ValidateDto();
    if (headOfSection) {
      await validate.fieldId('profiles', headOfSection);
    }
    if (eputeHead) {
      await validate.fieldId('profiles', eputeHead);
    }
    if (faculty) {
      await validate.fieldId('faculties', faculty);
    }
  }

  async createFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const { name, award } = createFacultyDto;
    const validate = new ValidateDto();
    const option = { name: name?.trim() };
    await this.validateDto(createFacultyDto);
    if (award.length > 0) {
      const awardIds = await validate.idLists('awards', award);
      createFacultyDto.award = awardIds;
    }
    await validate.existedByOptions('faculties', option, 'Faculty');
    const faculty = await new this.facultySchema(createFacultyDto).save();
    const result = await this.findFacultyById(faculty._id);
    return result;
  }

  async findFacultyById(id: string): Promise<Faculty> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupFaculty();
    const aggregate = [match, ...lookup];
    const result = await this.facultySchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Faculty not found.');
    }
    return result[0];
  }

  async updateFaculty(
    id: string,
    facultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    await this.validateDto(facultyDto);
    await this.facultySchema.findByIdAndUpdate(id, facultyDto);
    const result = await this.findFacultyById(id);
    return result;
  }

  async findAllFaculties(facultyQueryDto: FacultyQueryDto): Promise<Faculty[]> {
    const { searchKey } = facultyQueryDto;
    const match: Record<string, any> = { $match: {} };
    if (searchKey) {
      match.$match.name = new RegExp(searchKey);
    }
    const lookup = this.lookupFaculty();
    const aggregate = [match, ...lookup];
    const results = await this.facultySchema.aggregate(aggregate);
    return results;
  }

  async createMajor(majorDto: CreateMajorDto): Promise<Majors> {
    await this.validateDto(majorDto);
    const major = await new this.majorSchema(majorDto).save();
    const result = await this.findMajorById(major._id);
    return result;
  }

  async findMajorById(id: string): Promise<Majors> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupMajor();
    const aggregate = [match, ...lookup];
    const result = await this.majorSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Major not found.');
    }
    return result[0];
  }

  async updateMajor(id: string, majorDto: UpdateMajorDto): Promise<Majors> {
    await this.validateDto(majorDto);
    await this.majorSchema.findByIdAndUpdate(id, majorDto);
    const result = await this.findMajorById(id);
    return result;
  }

  async findAllMajors(queryDto: MajorQueryDto): Promise<Majors[]> {
    const { faculty } = queryDto;
    const match: Record<string, any> = { $match: {} };
    if (faculty) {
      match.$match.faculty = new Types.ObjectId(faculty);
    }
    const lookup = this.lookupMajor();
    const aggregate = [match, ...lookup];
    const results = await this.majorSchema.aggregate(aggregate);
    return results;
  }

  private lookupFaculty() {
    const lookup: any = new LookupCommon([
      {
        from: 'awards',
        localField: 'award',
        foreignField: '_id',
        as: 'award',
        unwind: false,
      },
      {
        from: 'profiles',
        localField: 'headOfSection',
        foreignField: '_id',
        as: 'headOfSection',
        unwind: true,
      },
      {
        from: 'profiles',
        localField: 'eputeHead',
        foreignField: '_id',
        as: 'eputeHead',
        unwind: true,
      },
    ]);
    return lookup;
  }

  private lookupMajor() {
    const lookup: any = new LookupCommon([
      {
        from: 'faculties',
        localField: 'faculty',
        foreignField: '_id',
        as: 'faculty',
        unwind: true,
      },
    ]);
    return [...this.lookupFaculty(), ...lookup];
  }
}
