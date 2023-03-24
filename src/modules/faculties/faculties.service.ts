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
import { CreateMajorDto } from './dtos/major.create.dto';
import { MajorQueryDto } from './dtos/major.query.dto';
import { UpdateMajorDto } from './dtos/major.update.dto';
import { Faculty, FacultyDocument } from './schemas/faculties.schema';
import { Majors, MajorsDocument } from './schemas/major.schema';

@Injectable()
export class FacultiesService {
  validate = new ValidateDto();
  constructor(
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
  ) {}

  async validateDto(dtos: Record<string, any>): Promise<void> {
    const { headOfSection, eputeHead, faculty } = dtos;
    if (headOfSection) {
      await this.validate.fieldId(collections.profiles, headOfSection);
    }
    if (eputeHead) {
      await this.validate.fieldId(collections.profiles, eputeHead);
    }
    if (faculty) {
      await this.validate.fieldId(collections.faculties, faculty);
    }
  }

  async createFaculty(
    createFacultyDto: CreateFacultyDto,
    createdBy: string,
  ): Promise<Faculty> {
    const { name, award = [] } = createFacultyDto;
    const validate = new ValidateDto();
    const option = { name: name?.trim() };
    await this.validateDto(createFacultyDto);
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
    const match: Record<string, any> = {
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
    await this.validateDto(facultyDto);
    const dto = {
      ...facultyDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.facultySchema.findByIdAndUpdate(id, dto);
    const result = await this.findFacultyById(id);
    return result;
  }

  async findAllFaculties(facultyQueryDto: FacultyQueryDto): Promise<Faculty[]> {
    const { searchKey } = facultyQueryDto;
    const match: Record<string, any> = { $match: { isDeleted: false } };
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
    await this.validateDto(majorDto);
    const major = await new this.majorSchema({ ...majorDto, createdBy }).save();
    const result = await this.findMajorById(major._id);
    return result;
  }

  async findMajorById(id: string): Promise<Majors> {
    const match: Record<string, any> = {
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
    await this.validateDto(majorDto);
    const dto = {
      ...majorDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.majorSchema.findByIdAndUpdate(id, dto);
    const result = await this.findMajorById(id);
    return result;
  }

  async findAllMajors(queryDto: MajorQueryDto): Promise<Majors[]> {
    const { faculty } = queryDto;
    const match: Record<string, any> = { $match: { isDeleted: false } };
    if (faculty) {
      match.$match.faculty = new Types.ObjectId(faculty);
    }
    const lookup = new LookupService().major();
    const aggregate = [match, ...lookup];
    const results = await this.majorSchema.aggregate(aggregate);
    return results;
  }
}
