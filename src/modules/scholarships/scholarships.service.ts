import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  considerConditionScholarshipPoint,
  EstatusUserProfile,
  trainningPointDefault,
} from 'src/constants/constant';
import {
  scholarshipMsg,
  semesterMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { SubjectUserRegister } from 'src/utils/utils.user.register-subject.query';
import { CreateScholarshipUser } from './dtos/scholarship.user.create.dto';
import { CreateScholarshipDto } from './dtos/scholarship.create.dto';
import { QueryScholarshipDto } from './dtos/scholarship.query.dto';
import { UpdateScholarshipDto } from './dtos/scholarship.update.dto';
import { QueryUserScholarshipDto } from './dtos/scholarship.user.query.dto';
import {
  Scholarship,
  ScholarshipDocument,
} from './schemas/scholarships.schema';
import {
  ScholarshipUser,
  ScholarshipUserDocument,
} from './schemas/scholarships.user.schema';
import {
  IgetUserScholarship,
  IqueryUserScholarship,
  IsemesterQueryScholarship,
  ItrainningPoint,
  IuserSubjectRegister,
} from './interfaces/scholarships.interface';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { selectAttachment, selectScholarship } from 'src/utils/utils.populate';
import {
  StudyProcessDocument,
  StudyProcesses,
} from '../study-process/schemas/study-process.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeDocument,
} from '../payments/schemas/payments.schema';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import {
  TrainningPoints,
  TranningPointsDocument,
} from '../trainning-point/schemas/trainning-point.schema';
import { trainningPointScholarshipLookup } from 'src/utils/utils.lookup.query.service';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class ScholarshipService {
  private populateSemester: string = 'semester';
  private populateAttachment: string = 'attachment';
  private populateScholarship: string = 'scholarship';
  private populateUser: string = 'user';

  constructor(
    @InjectModel(Scholarship.name)
    private readonly scholarshipSchema: Model<ScholarshipDocument>,
    @InjectModel(ScholarshipUser.name)
    private readonly scholarshipUserSchema: Model<ScholarshipUserDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(StudyProcesses.name)
    private readonly studyprocessSchema: Model<StudyProcessDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(PaymentStudyFee.name)
    private readonly paymentStudyFeeSchema: Model<PaymentStudyFeeDocument>,
    @InjectModel(TrainningPoints.name)
    private readonly trainningPointSchema: Model<TranningPointsDocument>,
    private readonly subjectRegister: SubjectUserRegister,
  ) {}

  public async createScholarship(
    scholarshipDto: CreateScholarshipDto,
    createdBy: string,
  ): Promise<Scholarship> {
    const { semester, name } = scholarshipDto;
    const valid = new ValidFields();
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    const options = {
      semester: new Types.ObjectId(semester),
      name: name.trim(),
      isDeleted: false,
    };
    const existedName = await this.scholarshipSchema.findOne(options);
    if (existedName) {
      new CommonException(HttpStatusCode.CONFLICT, scholarshipMsg.existedName);
    }
    const result = await new this.scholarshipSchema({
      ...scholarshipDto,
      createdBy,
    }).save();

    return result;
  }

  public async updateScholarship(
    id: string,
    scholarshipDto: UpdateScholarshipDto,
    updatedBy: string,
  ): Promise<Scholarship> {
    const { semester } = scholarshipDto;
    if (semester) {
      const valid = new ValidFields();
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    }
    const updateScholarshipDto = {
      ...scholarshipDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.scholarshipSchema.findByIdAndUpdate(
      id,
      updateScholarshipDto,
      {
        new: true,
      },
    );

    return result;
  }

  public async findScholarshipById(id: string): Promise<Scholarship> {
    const result = await this.scholarshipSchema
      .findById(id)
      .populate(
        this.populateSemester,
        selectScholarship.semester,
        this.semesterSchema,
        {
          isDeleted: false,
        },
      )
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .exec();
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, scholarshipMsg.notFound);
    }

    return result;
  }

  public async findAllScholarship(
    queryDto: QueryScholarshipDto,
  ): Promise<{ results: Scholarship[]; total: number }> {
    const { semester, type, limit, page, searchKey } = queryDto;
    const query: IsemesterQueryScholarship = { isDeleted: false };
    if (semester) {
      query.semester = new Types.ObjectId(semester);
    }
    if (type) {
      query.type = type.trim();
    }
    if (searchKey) {
      query.$or = [{ name: new RegExp(searchKey, 'i') }];
    }
    const results = await this.scholarshipSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate(
        this.populateSemester,
        selectScholarship.semester,
        this.semesterSchema,
        {
          isDeleted: false,
        },
      )
      .populate(
        this.populateAttachment,
        selectAttachment,
        this.attachmentSchema,
        {
          isDeleted: false,
        },
      )
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.scholarshipSchema.find(query).count();

    return { results, total };
  }

  public async findAllUserScholarShip(
    queryDto: QueryUserScholarshipDto,
  ): Promise<IgetUserScholarship[]> {
    const { scholarship, user, semester } = queryDto;
    const query: IqueryUserScholarship = { isDeleted: false };
    if (scholarship) {
      query.scholarship = new Types.ObjectId(scholarship);
    }
    if (user) {
      query.user = new Types.ObjectId(user);
    }
    const results: IgetUserScholarship[] = await this.scholarshipUserSchema
      .find(query)
      .populate(
        this.populateScholarship,
        selectScholarship.scholarship,
        this.scholarshipSchema,
        {
          isDeleted: false,
        },
      )
      .populate(this.populateUser, selectScholarship.user, this.profileSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean();
    const listUserTuitition = await this.paymentStudyFeeSchema.find({
      isDeleted: false,
    });
    const data = [];
    for await (const item of results) {
      let objUserScholarship = item;
      if (semester && semester !== String(item?.scholarship?.semester)) {
        objUserScholarship = null;
      }
      if (objUserScholarship) {
        const tuition = listUserTuitition.find(
          (fee: PaymentStudyFee) =>
            String(fee?.semester) === String(item?.scholarship?.semester) &&
            String(fee?.user) === String(item?.user?._id),
        );
        const rewardMoney =
          ((tuition?.totalMoney || 0) *
            (item?.scholarship?.percentTuition || 0)) /
          100;
        item.rewardMoney = rewardMoney;
        data.push(item);
      }
    }

    return data;
  }

  public async createUserScholarshipInSemester(
    semester: string,
    createdBy: string,
  ): Promise<ScholarshipUser[]> {
    const valid = new ValidFields();
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    const studyProcessLists = await this.studyprocessSchema.find({
      status: EstatusUserProfile.STUDYING,
      isDeleted: false,
    });
    if (studyProcessLists.length === 0) {
      return [];
    }
    const data = this.createUserScholarship(
      studyProcessLists,
      semester,
      createdBy,
    );

    return data;
  }

  public async createUserScholarship(
    studyProcessLists: StudyProcessDocument[],
    semester: string,
    createdBy: string,
  ): Promise<ScholarshipUser[]> {
    const listDto = [];
    for await (const item of studyProcessLists) {
      try {
        const { totalAccumalated, totalNumberCredits } =
          await this.getUserTotalAccumalated(semester, item._id);
        const accumalatedPoint =
          totalNumberCredits > 0 ? totalAccumalated / totalNumberCredits : 0;
        if (accumalatedPoint < considerConditionScholarshipPoint) {
          continue;
        }
        const tranningpoint = await this.getUserTrainningPoint(
          String(item.user),
          semester,
        );
        const getCondition = await this.considerConditions(
          accumalatedPoint,
          tranningpoint,
          totalNumberCredits,
          semester,
        );
        if (!getCondition) {
          continue;
        }
        const existed = await this.scholarshipUserSchema.findOne({
          scholarship: getCondition._id,
          user: item.user,
        });
        if (existed) {
          continue;
        }
        const userscholarshipDto: CreateScholarshipUser & {
          createdBy: string;
        } = {
          scholarship: getCondition._id,
          user: String(item.user),
          accumalatedPoint: accumalatedPoint,
          trainningPoint: tranningpoint,
          createdBy,
        };
        listDto.push(userscholarshipDto);
      } catch (error) {
        continue;
      }
    }
    const data = await this.scholarshipUserSchema.insertMany(listDto);

    return data;
  }

  public async deleteScholarship(id: string, deletedBy: string): Promise<void> {
    await this.findScholarshipById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.scholarshipSchema.findByIdAndUpdate(id, deleteDto);
  }

  public async deleteUserScholarship(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    await this.findScholarshipById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.scholarshipUserSchema.findByIdAndUpdate(id, deleteDto);
  }

  private async considerConditions(
    accumalatedPoint: number,
    tranningpoint: number,
    numberCredit: number,
    semester: string,
  ): Promise<ScholarshipDocument> {
    const result = await this.scholarshipSchema.findOne({
      semester: new Types.ObjectId(semester),
      minimunPoints: { $lte: accumalatedPoint },
      maximunPoints: { $gte: accumalatedPoint },
      trainningPoints: { $lte: tranningpoint },
      numberCredit: { $lte: numberCredit },
      isDeleted: false,
    });

    return result;
  }

  private async getUserTotalAccumalated(
    semester: string,
    studyprocess: string,
  ): Promise<{ totalAccumalated: number; totalNumberCredits: number }> {
    const subjectIds = await this.subjectRegister.getSubjectIds(semester);
    const result: IuserSubjectRegister[] =
      await this.subjectRegister.getUserSubjects(studyprocess, subjectIds);
    let totalAccumalated = 0;
    let totalNumberCredits = 0;
    if (result.length <= 0) {
      return { totalAccumalated, totalNumberCredits };
    }
    for (const item of result) {
      if (item.subject?.calculateCumulativePoint) {
        totalAccumalated +=
          (item?.accumalatedPoint || 0) * item?.subject?.numberCredits;
        totalNumberCredits += item?.subject?.numberCredits || 0;
      }
    }

    return { totalAccumalated, totalNumberCredits };
  }

  private async getUserTrainningPoint(
    profileId: string,
    semesterId: string,
  ): Promise<number> {
    const lookup = trainningPointScholarshipLookup();
    const aggregate = [
      {
        $match: {
          user: new Types.ObjectId(profileId),
          semester: new Types.ObjectId(semesterId),
          status: true,
        },
      },
      ...lookup,
    ];
    const results = await this.trainningPointSchema.aggregate(aggregate);
    const totalTrainningPoint = results.reduce(
      (x: ItrainningPoint, y: ItrainningPoint) =>
        (x.program?.point ?? 0) + (y.program?.point ?? 0),
      0,
    );
    const point = totalTrainningPoint + trainningPointDefault;

    return point > 100 ? 100 : point;
  }
}
