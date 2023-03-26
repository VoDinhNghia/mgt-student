import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound, msgResponse } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { ValidateDto } from 'src/validates/validates.common.dto';
import { CreateClassDto } from './dtos/class-subject.create-class.dto';
import { UpdateClassDto } from './dtos/class-subject.update-class.dto';
import { CreateSubjectDto } from './dtos/class-subject.create-subject.dto';
import { UpdateSubjectDto } from './dtos/class-subject.update-subject.dto';
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
import { ImatchFindClassSubject } from './interfaces/class-subject.find.match.interface';
import { classInfoLookup, subjectLookup } from 'src/utils/utils.lookup.query.service';

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
    const validate = new ValidateDto();
    await validate.existedByOptions(
      collections.class_infos,
      options,
      'Class name',
    );
    await validate.subjectClass(createClassDto);
    const newClass = await new this.classSchema({
      ...createClassDto,
      createdBy,
    }).save();
    const result = await this.findClassById(newClass._id);
    return result;
  }

  async findClassById(id: string): Promise<Class_Infos> {
    const match: ImatchFindClassSubject = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = classInfoLookup();
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
    await new ValidateDto().subjectClass(classDto);
    const dto = {
      ...classDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.classSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async createSubject(
    subjectDto: CreateSubjectDto,
    createdBy: string,
  ): Promise<Subjects> {
    await new ValidateDto().subjectClass(subjectDto);
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
  ): Promise<void> {
    try {
      await new this.subjectProcessSchema({
        subject: subjectId,
        ...processDto,
      }).save();
    } catch (error) {
      console.log(error);
      await this.subjectSchema.findByIdAndDelete(subjectId);
      new CommonException(500, msgResponse.createSubjectProcessError);
    }
  }

  async findSubjectById(id: string): Promise<Subjects> {
    const match: ImatchFindClassSubject = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = subjectLookup();
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
    await new ValidateDto().subjectClass(subjectDto);
    const dto = {
      ...subjectDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.subjectSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    await this.subjectProcessSchema.findOneAndUpdate(
      { subject: new Types.ObjectId(id) },
      dto,
    );
    return result;
  }
}
