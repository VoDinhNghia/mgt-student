import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound, msgResponse } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupService } from 'src/utils/lookup.query.service';
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
      collections.class_infos,
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
    const lookup = new LookupService().classInfo();
    const aggregate = [match, ...lookup];
    const result = await this.classSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
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
      new CommonException(500, msgResponse.createSubjectProcessError);
    }
  }

  async findSubjectById(id: string): Promise<Subjects> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = new LookupService().subject();
    const aggregate = [match, ...lookup];
    const result = await this.subjectSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
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
      await validate.fieldId(collections.courses, course);
    }
    if (homeroomteacher) {
      await validate.fieldId(collections.profiles, homeroomteacher);
    }
    if (lecturer) {
      await validate.fieldId(collections.profiles, lecturer);
    }
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
    }
    if (faculty) {
      await validate.fieldId(collections.faculties, faculty);
    }
    if (major) {
      await validate.fieldId(collections.majors, major);
    }
    if (degreeLevel) {
      await validate.fieldId(collections.degreelevels, degreeLevel);
    }
  }
}
