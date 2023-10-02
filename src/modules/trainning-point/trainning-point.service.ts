import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TrainningPoints,
  TranningPointsDocument,
} from './schemas/trainning-point.schema';
import { Model, Types } from 'mongoose';
import {
  VolunteePrograms,
  VolunteeProgramsDocument,
} from './schemas/trainning-point.voluntee-program.schema';
import {
  Faculty,
  FacultyDocument,
} from '../faculties/schemas/faculties.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import {
  ItrainningPointImport,
  IvolunteeImport,
  IqueryTrainningPoint,
  IqueryVoluntee,
} from './interfaces/trainning-point.interface';
import {
  facultiesMsg,
  semesterMsg,
  trainningPointMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import {
  EtypeVolunteeProgram,
  lengthRandomCodeVoluntee,
} from 'src/constants/constant';
import { CreateTrainningPointDto } from './dtos/trainning-point.create.dto';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import { GenerateCode } from 'src/utils/utils.generate.code';
import { CreateVolunteeProgramDto } from './dtos/trainning-point.create.voluntee-program.dto';
import { UpdateTrainningPointDto } from './dtos/trainning-point.update.dto';
import { UpdateVolunteeDto } from './dtos/trainning-point.update-voluntee.dto';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import {
  selectFaculty,
  selectProfile,
  selectSemester,
} from 'src/utils/utils.populate';
import { QueryTrainningPointDto } from './dtos/trainning-point.query.dto';
import { QueryVolunteeDto } from './dtos/trainning-point.query-voluntee.dto';
import { HttpStatusCode } from 'src/constants/constants.http-status';
import { deleteBody } from 'src/utils/utils.delete-body';

@Injectable()
export class TrainningPointService {
  private populateLeader: string = 'organizingCommittee.leader';
  private populateSemester: string = 'semester';
  private populateFaculty: string = 'faculty';
  private populateSecetary: string = 'organizingCommittee.secretary';
  private populateUser: string = 'user';
  private populateProgram: string = 'program';
  private codeValuntee: string = new GenerateCode().getRandomCodeVoluntee(
    lengthRandomCodeVoluntee,
  );

  constructor(
    @InjectModel(TrainningPoints.name)
    private readonly trainningPointSchema: Model<TranningPointsDocument>,
    @InjectModel(VolunteePrograms.name)
    private readonly volunteeProgramSchema: Model<VolunteeProgramsDocument>,
    @InjectModel(Faculty.name)
    private readonly facultySchema: Model<FacultyDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
  ) {}

  public async createTrainingPoint(
    createDto: CreateTrainningPointDto,
    createdBy: string,
  ): Promise<TrainningPoints> {
    const { user, semester, program } = createDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    await valid.id(
      this.volunteeProgramSchema,
      program,
      trainningPointMsg.notFoundVoluntee,
    );
    const result = await new this.trainningPointSchema({
      ...createDto,
      createdBy,
    }).save();

    return result;
  }

  public async createVoluntee(
    createDto: CreateVolunteeProgramDto,
    createdBy: string,
  ): Promise<VolunteePrograms> {
    const {
      faculty,
      semester,
      organizingCommittee: { leader, secretary },
    } = createDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, leader, userMsg.notFoundProfile);
    await valid.id(this.profileSchema, secretary, userMsg.notFoundProfile);
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    if (faculty) {
      await valid.id(this.facultySchema, faculty, facultiesMsg.notFound);
    }
    const result = await new this.volunteeProgramSchema({
      ...createDto,
      code: this.codeValuntee,
      createdBy,
    }).save();

    return result;
  }

  public async importVoluntee(
    data: IvolunteeImport[],
    createdBy: string,
  ): Promise<IvolunteeImport[]> {
    const faculties = await this.facultySchema.find({ isDeleted: false });
    const semesters = await this.semesterSchema.find({ isDeleted: false });
    const userProfiles = await this.profileSchema.find({ isDeleted: false });
    for await (const item of data) {
      const {
        faculty,
        semester,
        type,
        leader,
        secretary,
        title,
        location,
        startDate,
        endDate,
      } = item;
      if (!title || !location || !startDate || !type || !endDate) {
        item.status = trainningPointMsg.validateVoluntee;
        continue;
      }
      try {
        item.startDate = new Date(startDate);
        item.endDate = new Date(endDate);
      } catch {
        item.status = trainningPointMsg.validateDate;
        continue;
      }
      if (faculty || EtypeVolunteeProgram.FACULTY) {
        const facultyInfo = faculties.find(
          (fac: FacultyDocument) => fac.name === faculty.trim(),
        );
        if (!facultyInfo) {
          item.status = facultiesMsg.notFound;
          continue;
        }
        item.faculty = facultyInfo._id;
      }
      const semesterInfo = semesters.find(
        (sem: SemesterDocument) => semester === sem.code,
      );
      if (!semesterInfo) {
        item.status = semesterMsg.notFound;
        continue;
      }
      item.semester = semesterInfo._id;
      const leaderInfo = userProfiles.find(
        (pro: ProfileDocument) => pro.code === leader,
      );
      if (!leaderInfo) {
        item.status = userMsg.notFoundProfile;
        continue;
      }
      const secretaryInfo = userProfiles.find(
        (pro: ProfileDocument) => pro.code === secretary,
      );
      if (!secretaryInfo) {
        item.status = userMsg.notFoundProfile;
        continue;
      }
      item.organizingCommittee = {
        leader: leaderInfo._id,
        secretary: secretaryInfo._id,
      };
      item.code = this.codeValuntee;
      try {
        await new this.volunteeProgramSchema({ ...item, createdBy }).save();
        item.status = trainningPointMsg.statusImportVoluntee;
      } catch {
        item.status = trainningPointMsg.sysError;
        continue;
      }
    }

    return data;
  }

  public async importTrainningPoint(
    data: ItrainningPointImport[],
    createdBy: string,
  ): Promise<ItrainningPointImport[]> {
    const voluntees = await this.volunteeProgramSchema.find({
      isDeleted: false,
    });
    const semesters = await this.semesterSchema.find({ isDeleted: false });
    const userProfiles = await this.profileSchema.find({ isDeleted: false });
    for await (const item of data) {
      const { user, semester, program } = item;
      const userInfo = userProfiles.find(
        (pro: ProfileDocument) => pro.code === user,
      );
      if (!userInfo) {
        item.status = userMsg.notFoundProfile;
        continue;
      }
      item.user = userInfo._id;
      const semesterInfo = semesters.find(
        (sem: SemesterDocument) => semester === sem.code,
      );
      if (!semesterInfo) {
        item.status = semesterMsg.notFound;
        continue;
      }
      item.semester = semesterInfo._id;
      const volunteeInfo = voluntees.find(
        (vol: VolunteeProgramsDocument) => vol.code === program,
      );
      if (!volunteeInfo) {
        item.status = trainningPointMsg.notFoundVoluntee;
        continue;
      }
      item.program = volunteeInfo._id;
      try {
        await new this.trainningPointSchema({ ...item, createdBy }).save();
        item.status = trainningPointMsg.statusImportTrainningPoint;
      } catch {
        item.status = trainningPointMsg.sysError;
        continue;
      }
    }

    return data;
  }

  public async updateTrainningPoint(
    id: string,
    updateDto: UpdateTrainningPointDto,
    updatedBy: string,
  ): Promise<TrainningPoints> {
    const { user, semester, program } = updateDto;
    const valid = new ValidFields();
    if (user) {
      await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    }
    if (semester) {
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    }
    if (program) {
      await valid.id(
        this.volunteeProgramSchema,
        program,
        trainningPointMsg.notFoundVoluntee,
      );
    }
    const newDto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.trainningPointSchema.findByIdAndUpdate(
      id,
      newDto,
      { new: true },
    );

    return result;
  }

  public async updateVolutee(
    id: string,
    updateDto: UpdateVolunteeDto,
    updatedBy: string,
  ): Promise<VolunteePrograms> {
    const {
      faculty,
      semester,
      organizingCommittee: { leader, secretary },
    } = updateDto;
    const valid = new ValidFields();
    if (semester) {
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    }
    if (leader) {
      await valid.id(this.profileSchema, leader, userMsg.notFoundProfile);
    }
    if (secretary) {
      await valid.id(this.profileSchema, secretary, userMsg.notFoundProfile);
    }
    if (faculty) {
      await valid.id(this.facultySchema, faculty, facultiesMsg.notFound);
    }
    const newDto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.volunteeProgramSchema.findByIdAndUpdate(
      id,
      newDto,
      { new: true },
    );

    return result;
  }

  public async findTrainningPointById(id: string): Promise<TrainningPoints> {
    const result = await this.trainningPointSchema
      .findById(id)
      .populate(this.populateUser, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateSemester, selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .populate(this.populateProgram, '', this.volunteeProgramSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        trainningPointMsg.notFoundTrainningPoint,
      );
    }

    return result;
  }

  public async findVolunteeById(id: string): Promise<VolunteePrograms> {
    const result = await this.volunteeProgramSchema
      .findById(id)
      .populate(this.populateFaculty, selectFaculty, this.facultySchema, {
        isDeleted: false,
      })
      .populate(this.populateSemester, selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .populate(this.populateLeader, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateSecetary, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        trainningPointMsg.notFoundVoluntee,
      );
    }

    return result;
  }

  public async findAllTrainningPoint(
    queryDto: QueryTrainningPointDto,
  ): Promise<{ results: TrainningPoints[]; total: number }> {
    const { limit, page, user, program, semester } = queryDto;
    const query: IqueryTrainningPoint = { isDeleted: false };
    if (user) {
      query.user = new Types.ObjectId(user);
    }
    if (program) {
      query.program = new Types.ObjectId(program);
    }
    if (semester) {
      query.semester = new Types.ObjectId(semester);
    }
    const results = await this.trainningPointSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateUser, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateSemester, selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .populate(this.populateProgram, '', this.volunteeProgramSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.trainningPointSchema.find(query).count();

    return { results, total };
  }

  public async findAllVolunteeProgram(
    queryDto: QueryVolunteeDto,
  ): Promise<{ results: VolunteePrograms[]; total: number }> {
    const { limit, page, searchKey, semester, faculty, leader } = queryDto;
    const query: IqueryVoluntee = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    if (semester) {
      query.semester = new Types.ObjectId(semester);
    }
    if (faculty) {
      query.faculty = new Types.ObjectId(faculty);
    }
    if (leader) {
      query[this.populateLeader] = new Types.ObjectId(leader);
    }
    const results = await this.volunteeProgramSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(this.populateFaculty, selectFaculty, this.facultySchema, {
        isDeleted: false,
      })
      .populate(this.populateSemester, selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .populate(this.populateLeader, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .populate(this.populateSecetary, selectProfile, this.profileSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.volunteeProgramSchema.find(query).count();

    return { results, total };
  }

  public async deleteTrainningPoint(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    const deleteDto = deleteBody();
    await this.trainningPointSchema.findByIdAndUpdate(id, {
      ...deleteDto,
      deletedBy,
    });
  }

  public async deleteVoluntee(id: string, deletedBy: string): Promise<void> {
    const deleteDto = deleteBody();
    await this.volunteeProgramSchema.findByIdAndUpdate(id, {
      ...deleteDto,
      deletedBy,
    });
  }
}
