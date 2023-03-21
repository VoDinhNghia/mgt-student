import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collectionNames } from 'src/constants/constant';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateClassDto } from './dtos/class.create.dto';
import { UpdateClassDto } from './dtos/class.update.dto';
import { CreateSubjectDto } from './dtos/subject.create.dto';
import { UpdateSubjectDto } from './dtos/subject.update.dto';
import {
  Class_Infos,
  ClassInfosDocument,
} from './schemas/class-subject.class.schema';
import {
  SubjectDocument,
  Subjects,
} from './schemas/class-subject.subject.schema';
import {
  Subject_Process,
  SubjectProcessDocument,
} from './schemas/class-subject.subjectProcess';

@Injectable()
export class ClassSubjectService {
  constructor(
    @InjectModel(Class_Infos.name)
    private readonly classSchema: Model<ClassInfosDocument>,
    @InjectModel(Subjects.name)
    private readonly subjectSchema: Model<SubjectDocument>,
    @InjectModel(Subject_Process.name)
    private readonly subjectProcessSchema: Model<SubjectProcessDocument>,
  ) {}

  async createClass(
    createClassDto: CreateClassDto,
    createdBy: string,
  ): Promise<Class_Infos> {
    const options = { name: createClassDto.name?.trim() };
    await new ValidateDto().existedByOptions(
      collectionNames.class_infos,
      options,
      'Class name',
    );
    await this.validateDto(createClassDto);
    const newClass = await new this.classSchema({
      ...createClassDto,
      createdBy,
    }).save();
    const result = await this.findClassById(newClass._id);
    return result;
  }

  async findClassById(id: string): Promise<Class_Infos> {
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

  async updateClass(
    id: string,
    classDto: UpdateClassDto,
    updatedBy: string,
  ): Promise<Class_Infos> {
    await this.validateDto(classDto);
    const dto = {
      ...classDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.classSchema.findByIdAndUpdate(id, dto);
    const result = await this.findClassById(id);
    return result;
  }

  async createSubject(
    subjectDto: CreateSubjectDto,
    createdBy: string,
  ): Promise<Subjects> {
    await this.validateDto(subjectDto);
    const dto = {
      ...subjectDto,
      createdBy,
    };
    const subject = await new this.subjectSchema(dto).save();
    await this.createSubjectProcess(subject._id, dto);
    const result = await this.findSubjectById(subject._id);
    return result;
  }

  async createSubjectProcess(
    subjectId: string,
    processDto: CreateSubjectDto,
  ): Promise<Subject_Process> {
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
    updatedBy: string,
  ): Promise<Subjects> {
    await this.validateDto(subjectDto);
    const dto = {
      ...subjectDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.subjectSchema.findByIdAndUpdate(id, dto);
    await this.subjectProcessSchema.findOneAndUpdate(
      { subject: new Types.ObjectId(id) },
      dto,
    );
    const result = await this.findSubjectById(id);
    return result;
  }

  async validateDto(dtos: Record<string, any>): Promise<void> {
    const {
      course,
      degreeLevel,
      major,
      homeroomteacher,
      semester,
      faculty,
      lecturer,
    } = dtos;
    const validate = new ValidateDto();
    if (course) {
      await validate.fieldId(collectionNames.courses, course);
    }
    if (homeroomteacher) {
      await validate.fieldId(collectionNames.profiles, homeroomteacher);
    }
    if (lecturer) {
      await validate.fieldId(collectionNames.profiles, lecturer);
    }
    if (semester) {
      await validate.fieldId(collectionNames.semesters, semester);
    }
    if (faculty) {
      await validate.fieldId(collectionNames.faculties, faculty);
    }
    if (major) {
      await validate.fieldId(collectionNames.majors, major);
    }
    if (degreeLevel) {
      await validate.fieldId(collectionNames.degreelevels, degreeLevel);
    }
  }

  private lookupClass() {
    const lookup: any = new LookupCommon([
      {
        from: collectionNames.degreelevels,
        localField: 'degreeLevel',
        foreignField: '_id',
        as: 'degreeLevel',
        unwind: true,
      },
      {
        from: collectionNames.profiles,
        localField: 'homeroomteacher',
        foreignField: '_id',
        as: 'homeroomteacher',
        unwind: true,
      },
    ]);
    return [...this.lookupCommon(), ...lookup];
  }

  private lookupSubject() {
    const lookup: any = new LookupCommon([
      {
        from: collectionNames.semesters,
        localField: 'semester',
        foreignField: '_id',
        as: 'semester',
        unwind: true,
      },
      {
        from: collectionNames.profiles,
        localField: 'lecturer',
        foreignField: '_id',
        as: 'lecturer',
        unwind: true,
      },
      {
        from: collectionNames.subject_processes,
        localField: '_id',
        foreignField: 'subject',
        as: 'process',
        unwind: true,
      },
    ]);
    return [...this.lookupCommon(), ...lookup];
  }

  private lookupCommon() {
    const lookup: any = new LookupCommon([
      {
        from: collectionNames.courses,
        localField: 'course',
        foreignField: '_id',
        as: 'course',
        unwind: true,
      },
      {
        from: collectionNames.majors,
        localField: 'major',
        foreignField: '_id',
        as: 'major',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
