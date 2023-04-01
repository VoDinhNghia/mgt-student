import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  considerConditionScholarshipPoint,
  EstatusUserProfile,
} from 'src/constants/constant';
import {
  scholarshipMsg,
  semesterMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { QueryService } from 'src/utils/utils.query.service';
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
} from './interfaces/scholarships.find.interface';
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

@Injectable()
export class ScholarshipService {
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
  ) {}

  async createScholarship(
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
      new CommonException(409, scholarshipMsg.existedName);
    }
    const result = await new this.scholarshipSchema({
      ...scholarshipDto,
      createdBy,
    }).save();
    return result;
  }

  async updateScholarship(
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

  async findScholarshipById(id: string): Promise<Scholarship> {
    const result = await this.scholarshipSchema
      .findById(id)
      .populate('semester', selectScholarship.semester, this.semesterSchema, {
        isDeleted: false,
      })
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(404, scholarshipMsg.notFound);
    }
    return result;
  }

  async findAllScholarship(
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
      .populate('semester', selectScholarship.semester, this.semesterSchema, {
        isDeleted: false,
      })
      .populate('attachment', selectAttachment, this.attachmentSchema, {
        isDeleted: false,
      })
      .exec();
    const total = await this.scholarshipSchema.find(query).count();
    return { results, total };
  }

  async findAllUserScholarShip(
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
        'scholarship',
        selectScholarship.scholarship,
        this.scholarshipSchema,
        {
          isDeleted: false,
        },
      )
      .populate('user', selectScholarship.user, this.profileSchema, {
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

  async createUserScholarshipInSemester(
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

  async createUserScholarship(
    studyProcessLists: StudyProcesses[],
    semester: string,
    createdBy: string,
  ): Promise<ScholarshipUser[]> {
    const listDto = [];
    for await (const item of studyProcessLists) {
      try {
        const { totalAccumalated, totalNumberCredits } =
          await new SubjectUserRegister().getUserTotalAccumalated(
            semester,
            String(item.user),
          );
        const accumalatedPoint =
          totalNumberCredits > 0 ? totalAccumalated / totalNumberCredits : 0;
        if (accumalatedPoint < considerConditionScholarshipPoint) {
          continue;
        }
        const tranningpoint = await new QueryService().getUserTrainningPoint(
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
        console.log(error);
        continue;
      }
    }
    const data = await this.scholarshipUserSchema.insertMany(listDto);
    return data;
  }

  async considerConditions(
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

  async deleteScholarship(id: string, deletedBy: string): Promise<void> {
    await this.findScholarshipById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.scholarshipSchema.findByIdAndUpdate(id, deleteDto);
  }

  async deleteUserScholarship(id: string, deletedBy: string): Promise<void> {
    await this.findScholarshipById(id);
    const deleteDto = {
      deletedBy,
      isDeleted: true,
      deletedAt: Date.now(),
    };
    await this.scholarshipUserSchema.findByIdAndUpdate(id, deleteDto);
  }
}
