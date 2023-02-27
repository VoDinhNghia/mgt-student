import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonException } from 'src/abstracts/execeptionError';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Course, CourseDocument } from '../courses/schemas/courses.schema';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from '../degreelevel/schemas/degreelevel.schema';
import { Majors, MajorsDocument } from '../faculties/schemas/major.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { CreateClassDto } from './dtos/class-subject.create-class.dto';
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
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
    private readonly validateField: ValidateField,
  ) {}

  // When create subject => create subject project

  async validateClass(classDto: Record<string, any>): Promise<void> {
    const { course, degreeLevel, major, homeroomteacher } = classDto;
    await this.validateField.byId(this.courseSchema, course, 'Course');
    if (homeroomteacher) {
      await this.validateField.byId(
        this.profileSchema,
        homeroomteacher,
        'User',
      );
    }
    await this.validateField.byId(this.majorSchema, major, 'Major');
    await this.validateField.byId(
      this.degreeLevelSchema,
      degreeLevel,
      'DegreeLevel',
    );
  }

  async createClass(createClassDto: CreateClassDto): Promise<ClassInfos> {
    const options = { name: createClassDto?.name?.trim() };
    await this.validateField.existed(this.classSchema, options, 'Class name');
    await this.validateClass(createClassDto);
    const createNew = await new this.classSchema(createClassDto).save();
    return createNew;
  }

  async findOneClass(option: Record<string, any>): Promise<ClassInfos> {
    const result = await this.classSchema.findOne(option);
    if (!result) {
      new CommonException(404, `Class not found.`);
    }
    return result;
  }

  async findClassById(id: string): Promise<ClassInfos> {
    const result = await this.classSchema
      .findById(id)
      .populate('course', '', this.courseSchema)
      .populate('degreelevel', '', this.degreeLevelSchema)
      .populate('major', '', this.majorSchema)
      .populate('homeroomteacher', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, `Class not found`);
    }
    return result;
  }
}
