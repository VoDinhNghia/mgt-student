import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateField } from 'src/abstracts/validateFieldById';
import { Course, CourseDocument } from '../courses/schemas/courses.schema';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from '../degreelevel/schemas/degreelevel.schema';
import { Majors, MajorsDocument } from '../faculties/schemas/major.schema';
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
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
    private readonly validateField: ValidateField,
  ) {}

  async createClass(createClassDto: CreateClassDto): Promise<ClassInfos> {
    const { course, degreeLevel, major, homeroomteacher } = createClassDto;
    const options = { name: createClassDto?.name?.trim() };
    await this.validateField.existed(this.classSchema, options, 'Class name');
    await this.validateField.byId(this.courseSchema, course, 'Course');
    await this.validateField.byId(this.userSchema, homeroomteacher, 'User');
    await this.validateField.byId(this.majorSchema, major, 'Major');
    await this.validateField.byId(
      this.degreeLevelSchema,
      degreeLevel,
      'DegreeLevel',
    );

    const createNew = await new this.classSchema(createClassDto).save();
    return createNew;
  }

  async findOneClass(option: Record<string, any>): Promise<ClassInfos> {
    const result = await this.classSchema.findOne(option);
    return result;
  }
}
