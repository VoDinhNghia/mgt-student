import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateField } from 'src/validates/validate.field-id.dto';
import { Course, CourseDocument } from '../courses/schemas/courses.schema';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from '../degreelevels/schemas/degreelevels.schema';
import {
  Faculty,
  FacultyDocument,
} from '../faculties/schemas/faculties.schema';
import { Majors, MajorsDocument } from '../faculties/schemas/major.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
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
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
    @InjectModel(DegreeLevel.name)
    private readonly degreeLevelSchema: Model<DegreeLevelDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    private readonly validate: ValidateField,
  ) {}

  // When create subject => create subject project

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
    await this.validate.byId(this.courseSchema, course, 'Course');
    if (homeroomteacher) {
      await this.validate.byId(
        this.profileSchema,
        homeroomteacher,
        'User Profile',
      );
    }
    if (lecturer) {
      await this.validate.byId(this.profileSchema, lecturer, 'User Profile');
    }
    if (semester) {
      await this.validate.byId(this.semesterSchema, semester, 'Semester');
    }
    if (faculty) {
      await this.validate.byId(this.facultySchema, faculty, 'Faculty');
    }
    await this.validate.byId(this.majorSchema, major, 'Major');
    await this.validate.byId(
      this.degreeLevelSchema,
      degreeLevel,
      'DegreeLevel',
    );
  }

  async createClass(createClassDto: CreateClassDto): Promise<ClassInfos> {
    const options = { name: createClassDto?.name?.trim() };
    await this.validate.existed(this.classSchema, options, 'Class name');
    await this.validateCommon(createClassDto);
    const newClass = await new this.classSchema(createClassDto).save();
    const result = await this.findClassById(newClass._id);
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
    const aggre = [{ $match: { _id: new Types.ObjectId(id) } }];
    const aggregate = this.lookupSubject(aggre);
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

  lookupSubject(aggre = []) {
    const lookup: any = new LookupCommon([
      {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
        unwind: true,
      },
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
        from: 'majors',
        localField: 'major',
        foreignField: '_id',
        as: 'major',
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
    const aggregate = [...aggre, ...lookup];
    return aggregate;
  }
}
