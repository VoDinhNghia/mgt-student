import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  classMsg,
  courseMsg,
  degreeLevelMsg,
  facultiesMsg,
  semesterMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { CreateClassDto } from './dtos/class-subject.create-class.dto';
import { UpdateClassDto } from './dtos/class-subject.update-class.dto';
import { CreateSubjectDto } from './dtos/class-subject.create-subject.dto';
import { UpdateSubjectDto } from './dtos/class-subject.update-subject.dto';
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
import {
  ImatchSubject,
  IqueryClasses,
} from './interfaces/class-subject.interface';
import { subjectLookup } from 'src/utils/utils.lookup.query.service';
import { Course, CourseDocument } from '../courses/schemas/courses.schema';
import {
  DegreeLevel,
  DegreeLevelDocument,
} from '../degreelevels/schemas/degreelevels.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import {
  Majors,
  MajorsDocument,
} from '../faculties/schemas/faculties.major.schema';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  selectCourse,
  selectDegreelevel,
  selectMajor,
  selectProfile,
} from 'src/utils/utils.populate';
import { QueryClassDto } from './dtos/class-subject.query-class.dto';
import { QuerySubjectDto } from './dtos/class-subject.query-subject.dto';
import { skipLimitAndSortPagination } from 'src/utils/utils.page.pagination';
import { HttpStatusCode } from 'src/constants/constants.http-status';
import { deleteBody } from 'src/utils/utils.delete-body';

@Injectable()
export class ClassSubjectService {
  private populateMajor: string = 'major';
  private populateCourse: string = 'course';
  private populateDegreeLevel: string = 'degreeLevel';
  private populateHomeRoomTeacher: string = 'homeroomteacher';

  constructor(
    @InjectModel(ClassInfos.name)
    private readonly classSchema: Model<ClassInfosDocument>,
    @InjectModel(Subjects.name)
    private readonly subjectSchema: Model<SubjectDocument>,
    @InjectModel(SubjectProcess.name)
    private readonly subjectProcessSchema: Model<SubjectProcessDocument>,
    @InjectModel(Course.name)
    private readonly courseSchema: Model<CourseDocument>,
    @InjectModel(DegreeLevel.name)
    private readonly degreelevelSchema: Model<DegreeLevelDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Majors.name)
    private readonly majorSchema: Model<MajorsDocument>,
  ) {}

  public async createClass(
    createClassDto: CreateClassDto,
    createdBy: string,
  ): Promise<ClassInfos> {
    const { name, course, degreeLevel, major, homeroomteacher } =
      createClassDto;
    const valid = new ValidFields();
    await valid.id(this.courseSchema, course, courseMsg.notFound);
    await valid.id(
      this.degreelevelSchema,
      degreeLevel,
      degreeLevelMsg.notFound,
    );
    await valid.id(this.majorSchema, major, facultiesMsg.notFound);
    await this.validateClassName(name);
    if (homeroomteacher) {
      await valid.id(
        this.profileSchema,
        homeroomteacher,
        userMsg.notFoundProfile,
      );
    }
    const result = await new this.classSchema({
      ...createClassDto,
      createdBy,
    }).save();

    return result;
  }

  public async findClassById(id: string): Promise<ClassInfos> {
    const result = await this.classSchema
      .findById(id)
      .populate(this.populateMajor, selectMajor, this.majorSchema, {
        isDeleted: false,
      })
      .populate(this.populateCourse, selectCourse, this.courseSchema, {
        isDeleted: false,
      })
      .populate(
        this.populateDegreeLevel,
        selectDegreelevel,
        this.degreelevelSchema,
        {
          isDeleted: false,
        },
      )
      .populate(
        this.populateHomeRoomTeacher,
        selectProfile,
        this.profileSchema,
        {
          isDeleted: false,
        },
      )
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, classMsg.notFoud);
    }

    return result;
  }

  public async findAllClasses(
    queryDto: QueryClassDto,
  ): Promise<{ results: ClassInfos[]; total: number }> {
    const {
      limit,
      page,
      searchKey,
      major,
      degreeLevel,
      homeroomteacher,
      course,
    } = queryDto;
    const query: IqueryClasses = { isDeleted: false };
    if (major) {
      query.major = new Types.ObjectId(major);
    }
    if (degreeLevel) {
      query.degreeLevel = new Types.ObjectId(degreeLevel);
    }
    if (course) {
      query.course = new Types.ObjectId(course);
    }
    if (homeroomteacher) {
      query.homeroomteacher = new Types.ObjectId(homeroomteacher);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.classSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateMajor, selectMajor, this.majorSchema, {
        isDeleted: false,
      })
      .populate(this.populateCourse, selectCourse, this.courseSchema, {
        isDeleted: false,
      })
      .populate(
        this.populateDegreeLevel,
        selectDegreelevel,
        this.degreelevelSchema,
        {
          isDeleted: false,
        },
      )
      .populate(
        this.populateHomeRoomTeacher,
        selectProfile,
        this.profileSchema,
        {
          isDeleted: false,
        },
      )
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.classSchema.find(query).count();

    return { results, total };
  }

  public async updateClass(
    id: string,
    classDto: UpdateClassDto,
    updatedBy: string,
  ): Promise<ClassInfos> {
    const { course, degreeLevel, major, homeroomteacher } = classDto;
    const valid = new ValidFields();
    if (course) {
      await valid.id(this.courseSchema, course, courseMsg.notFound);
    }
    if (degreeLevel) {
      await valid.id(
        this.degreelevelSchema,
        degreeLevel,
        degreeLevelMsg.notFound,
      );
    }
    if (major) {
      await valid.id(this.majorSchema, major, facultiesMsg.notFound);
    }
    if (homeroomteacher) {
      await valid.id(
        this.profileSchema,
        homeroomteacher,
        userMsg.notFoundProfile,
      );
    }
    const updateDto = {
      ...classDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.classSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });

    return result;
  }

  public async createSubject(
    subjectDto: CreateSubjectDto,
    createdBy: string,
  ): Promise<Subjects> {
    const { major, degreeLevel, course, semester, lecturer } = subjectDto;
    const valid = new ValidFields();
    await valid.id(this.majorSchema, major, facultiesMsg.notFoundMajor);
    await valid.id(
      this.degreelevelSchema,
      degreeLevel,
      degreeLevelMsg.notFound,
    );
    await valid.id(this.courseSchema, course, courseMsg.notFound);
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    await valid.id(this.profileSchema, lecturer, userMsg.notFoundProfile);
    const createDto = {
      ...subjectDto,
      createdBy,
    };
    const subject = await new this.subjectSchema(createDto).save();
    await this.createSubjectProcess(subject._id, createDto);
    const result = await this.findSubjectById(subject._id);

    return result;
  }

  public async findSubjectById(id: string): Promise<Subjects> {
    const match: ImatchSubject = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = subjectLookup();
    const aggregate = [match, ...lookup];
    const result = await this.subjectSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(HttpStatusCode.NOT_FOUND, classMsg.notFoundSubject);
    }

    return result[0];
  }

  public async findAllSubjects(
    queryDto: QuerySubjectDto,
  ): Promise<{ results: Subjects[]; total: number }> {
    const {
      searchKey,
      limit,
      page,
      course,
      lecturer,
      degreeLevel,
      semester,
      major,
    } = queryDto;
    const match: ImatchSubject = { $match: { isDeleted: false } };
    if (searchKey) {
      match.$match.name = new RegExp(searchKey, 'i');
    }
    if (major) {
      match.$match.major = new Types.ObjectId(major);
    }
    if (lecturer) {
      match.$match.lecturer = new Types.ObjectId(lecturer);
    }
    if (course) {
      match.$match.course = new Types.ObjectId(course);
    }
    if (degreeLevel) {
      match.$match.degreeLevel = new Types.ObjectId(degreeLevel);
    }
    if (semester) {
      match.$match.semester = new Types.ObjectId(semester);
    }
    const lookup = subjectLookup();
    const pagination = skipLimitAndSortPagination(limit, page);
    const aggregate = [match, ...pagination, ...lookup];
    const aggregateTotal = [match, ...lookup, { $count: 'total' }];
    const results = await this.subjectSchema.aggregate(aggregate);
    const total = await this.subjectSchema.aggregate(aggregateTotal);

    return {
      results,
      total: total[0]?.total ?? 0,
    };
  }

  public async updateSubject(
    id: string,
    subjectDto: UpdateSubjectDto,
    updatedBy: string,
  ): Promise<Subjects> {
    const { major, degreeLevel, course, semester, lecturer } = subjectDto;
    await this.validatePercent(id, subjectDto);
    const valid = new ValidFields();
    if (major) {
      await valid.id(this.majorSchema, major, facultiesMsg.notFoundMajor);
    }
    if (degreeLevel) {
      await valid.id(
        this.degreelevelSchema,
        degreeLevel,
        degreeLevelMsg.notFound,
      );
    }
    if (course) {
      await valid.id(this.courseSchema, course, courseMsg.notFound);
    }
    if (semester) {
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    }
    if (lecturer) {
      await valid.id(this.profileSchema, lecturer, userMsg.notFoundProfile);
    }
    const updateDto = {
      ...subjectDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.subjectSchema.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    await this.subjectProcessSchema.findOneAndUpdate(
      { subject: new Types.ObjectId(id) },
      updateDto,
    );
    const result = await this.findSubjectById(id);

    return result;
  }

  public async deleteSubject(id: string, deletedBy: string): Promise<void> {
    const deleteDto = deleteBody();
    await this.subjectSchema.findByIdAndUpdate(id, { ...deleteDto, deletedBy });
    await this.subjectProcessSchema.findOneAndUpdate(
      { subject: new Types.ObjectId(id) },
      deleteDto,
    );
  }

  private async createSubjectProcess(
    subjectId: string,
    processDto: CreateSubjectDto,
  ): Promise<void> {
    try {
      await new this.subjectProcessSchema({
        subject: subjectId,
        ...processDto,
      }).save();
    } catch (error) {
      await this.subjectSchema.findByIdAndDelete(subjectId);
      new CommonException(
        HttpStatusCode.SERVER_INTERVAL,
        classMsg.createSubjectProcessError,
      );
    }
  }

  private async validateClassName(name: string): Promise<void> {
    const options = { name: name?.trim(), isDeleted: false };
    const existed = await this.classSchema.findOne(options);
    if (existed) {
      new CommonException(HttpStatusCode.CONFLICT, classMsg.existedClassName);
    }
  }

  private async validatePercent(
    subjectId: string,
    subjectDto: UpdateSubjectDto,
  ): Promise<void> {
    const { midTermTest = {}, finalExam = {}, studentEssay = {} } = subjectDto;
    const subjectProcess = await this.subjectProcessSchema.findOne({
      subject: new Types.ObjectId(subjectId),
      isDeleted: false,
    });
    if (!subjectProcess) {
      new CommonException(HttpStatusCode.NOT_FOUND, classMsg.notFoundSubject);
    }
    const midPercent =
      midTermTest?.percent || subjectProcess?.midTermTest?.percent;
    const finalPercent =
      finalExam?.percent || subjectProcess?.finalExam?.percent;
    const essayPercent =
      studentEssay?.percent || subjectProcess?.studentEssay?.percent;
    const totalPercent = midPercent + finalPercent + essayPercent;
    if (totalPercent !== 100) {
      new CommonException(
        HttpStatusCode.BAD_REQUEST,
        classMsg.validateTotalPercent,
      );
    }
  }
}
