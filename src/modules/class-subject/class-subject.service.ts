import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateClassDto } from './dtos/class.create.dto';
import { UpdateClassDto } from './dtos/class.update.dto';
import { CreateSubjectDto } from './dtos/subject.create.dto';
import { UpdateSubjectDto } from './dtos/subject.update.dto';
import {
  ClassInfos,
  ClassInfosDocument,
} from './schemas/class-subject.class.schema';
import {
  SubjectDocument,
  Subjects,
} from './schemas/class-subject.subject.schema';
import {
  SubjectProcess,
  SubjectProcessDocument,
} from './schemas/class-subject.subjectProcess';

@Injectable()
export class ClassSubjectService {
  constructor(
    @InjectModel(ClassInfos.name)
    private readonly classSchema: Model<ClassInfosDocument>,
    @InjectModel(Subjects.name)
    private readonly subjectSchema: Model<SubjectDocument>,
    @InjectModel(SubjectProcess.name)
    private readonly subjectProcessSchema: Model<SubjectProcessDocument>,
  ) {}

  async createClass(createClassDto: CreateClassDto): Promise<ClassInfos> {
    const options = { name: createClassDto?.name?.trim() };
    await new ValidateDto().existedByOptions(
      'classinfos',
      options,
      'Class name',
    );
    await this.validateCommon(createClassDto);
    const newClass = await new this.classSchema(createClassDto).save();
    const result = await this.findClassById(newClass._id);
    return result;
  }

  async findClassById(id: string): Promise<ClassInfos> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupClass();
    const aggregate = [match, ...lookup];
    const result = await this.classSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, `Class not found`);
    }
    return result[0];
  }

  async updateClass(id: string, classDto: UpdateClassDto): Promise<ClassInfos> {
    await this.validateCommon(classDto);
    await this.classSchema.findByIdAndUpdate(id, classDto);
    const result = await this.findClassById(id);
    return result;
  }

  async createSubject(subjectDto: CreateSubjectDto): Promise<Subjects> {
    await this.validateCommon(subjectDto);
    const subject = await new this.subjectSchema(subjectDto).save();
    await this.createSubjectProcess(subject._id, subjectDto);
    const result = await this.findSubjectById(subject._id);
    return result;
  }

  async createSubjectProcess(
    subjectId: string,
    processDto: CreateSubjectDto,
  ): Promise<SubjectProcess> {
    try {
      const result = await new this.subjectProcessSchema({
        subject: subjectId,
        ...processDto,
      }).save();
      return result;
    } catch (error) {
      console.log(error);
      await this.subjectSchema.findByIdAndDelete(subjectId);
      new CommonException(500, 'Can not create subject process.');
    }
  }

  async findSubjectById(id: string): Promise<Subjects> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupSubject();
    const aggregate = [match, ...lookup];
    const result = await this.subjectSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Subject not found.');
    }
    return result[0];
  }

  async updateSubject(
    id: string,
    subjectDto: UpdateSubjectDto,
  ): Promise<Subjects> {
    await this.validateCommon(subjectDto);
    await this.subjectSchema.findByIdAndUpdate(id, subjectDto);
    await this.subjectProcessSchema.findOneAndUpdate(
      { subject: new Types.ObjectId(id) },
      subjectDto,
    );
    const result = await this.findSubjectById(id);
    return result;
  }

  async validateCommon(validateDto: Record<string, any>): Promise<void> {
    const {
      course,
      degreeLevel,
      major,
      homeroomteacher,
      semester,
      faculty,
      lecturer,
    } = validateDto;
    const validate = new ValidateDto();
    if (course) {
      await validate.fieldId('courses', course);
    }
    if (homeroomteacher) {
      await validate.fieldId('profiles', homeroomteacher);
    }
    if (lecturer) {
      await validate.fieldId('profiles', lecturer);
    }
    if (semester) {
      await validate.fieldId('semesters', semester);
    }
    if (faculty) {
      await validate.fieldId('faculties', faculty);
    }
    if (major) {
      await validate.fieldId('majors', major);
    }
    if (degreeLevel) {
      await validate.fieldId('degreelevels', degreeLevel);
    }
  }

  lookupClass() {
    const lookup: any = new LookupCommon([
      {
        from: 'degreelevels',
        localField: 'degreeLevel',
        foreignField: '_id',
        as: 'degreeLevel',
        unwind: true,
      },
      {
        from: 'profiles',
        localField: 'homeroomteacher',
        foreignField: '_id',
        as: 'homeroomteacher',
        unwind: true,
      },
    ]);
    return [...this.lookupCommon(), ...lookup];
  }

  lookupSubject() {
    const lookup: any = new LookupCommon([
      {
        from: 'semesters',
        localField: 'semester',
        foreignField: '_id',
        as: 'semester',
        unwind: true,
      },
      {
        from: 'profiles',
        localField: 'lecturer',
        foreignField: '_id',
        as: 'lecturer',
        unwind: true,
      },
      {
        from: 'subjectprocesses',
        localField: '_id',
        foreignField: 'subject',
        as: 'process',
        unwind: true,
      },
    ]);
    return [...this.lookupCommon(), ...lookup];
  }

  lookupCommon() {
    const lookup: any = new LookupCommon([
      {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
        unwind: true,
      },
      {
        from: 'majors',
        localField: 'major',
        foreignField: '_id',
        as: 'major',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
