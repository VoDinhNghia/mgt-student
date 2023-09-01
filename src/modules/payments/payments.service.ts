import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstatusPayments } from 'src/constants/constant';
import {
  paymentMsg,
  semesterMsg,
  settingMsg,
  studyProcessMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { SubjectUserRegister } from 'src/utils/utils.user.register-subject.query';
import { QueryTuitionUser } from './dtos/payments.query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/payments.users.create.dto';
import { UpdateUserPaymentDto } from './dtos/payments.users.update.dto';
import {
  PaymentStudyFee,
  PaymentStudyFeeDocument,
} from './schemas/payments.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { selectSemester, selectProfile } from 'src/utils/utils.populate';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { IuserRegisterResponse } from './interfaces/payments.interface';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import { getRandomCodeReceiptId } from 'src/utils/utils.generate.code';
import {
  StudyProcessDocument,
  StudyProcesses,
} from '../study-process/schemas/study-process.schema';
import {
  SettingMoneyCredit,
  SettingMoneyCreditDocument,
} from '../settings/schemas/settings.money-credit.schema';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(SettingMoneyCredit.name)
    private readonly moneyCreditSchema: Model<SettingMoneyCreditDocument>,
    @InjectModel(PaymentStudyFee.name)
    private readonly paymentSchema: Model<PaymentStudyFeeDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(StudyProcesses.name)
    private readonly studyprocessSchema: Model<StudyProcessDocument>,
    private readonly subjectRegister: SubjectUserRegister,
  ) {}

  async createUserPayment(
    paymentDto: CreateUserPaymentDto,
    createdBy: string,
  ): Promise<PaymentStudyFee> {
    const { user, semester } = paymentDto;
    const valid = new ValidFields();
    await valid.id(this.profileSchema, user, userMsg.notFoundProfile);
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    const newPaymentDto: CreateUserPaymentDto & {
      receiptId: string;
      createdBy: string;
    } = {
      ...paymentDto,
      receiptId: getRandomCodeReceiptId(4),
      createdBy,
    };
    const result = await new this.paymentSchema(newPaymentDto).save();
    return result;
  }

  async updateUserPayment(
    id: string,
    paymentDto: UpdateUserPaymentDto,
    updatedBy: string,
  ): Promise<PaymentStudyFee> {
    const { semester } = paymentDto;
    if (semester) {
      const valid = new ValidFields();
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    }
    const dto = {
      ...paymentDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.paymentSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findUserPaymentById(id: string): Promise<PaymentStudyFee> {
    const result = await this.paymentSchema
      .findById(id)
      .populate('user', selectProfile, this.profileSchema, { isDeleted: false })
      .populate('semester', selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        paymentMsg.notFoundUserPayment,
      );
    }
    return result;
  }

  async findTuitionUserInSemester(
    queryDto: QueryTuitionUser,
  ): Promise<{ subjects: IuserRegisterResponse[]; tuitionStatus: string }> {
    const { semester, profile } = queryDto;
    if (semester) {
      const valid = new ValidFields();
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    }
    if (profile) {
      const valid = new ValidFields();
      await valid.id(this.profileSchema, profile, userMsg.notFoundProfile);
    }
    const options = {
      user: new Types.ObjectId(profile),
      semester: new Types.ObjectId(semester),
      isDeleted: false,
    };
    const studyProcessId = await this.getStudyProcessId(profile);
    const subjectIds = await this.subjectRegister.getSubjectIds(semester);
    const subjects = await this.subjectRegister.getUserSubjects(
      studyProcessId,
      subjectIds,
    );
    const listSubjectUser = await this.getTotalMoneySubject(subjects, semester);
    const tuitionInsemester = await this.paymentSchema.findOne(options);
    const result = {
      subjects: listSubjectUser,
      tuitionStatus: tuitionInsemester?.status || EstatusPayments.OWED,
    };
    return result;
  }

  async getTotalMoneySubject(
    subjectList: IuserRegisterResponse[],
    semester: string,
  ): Promise<IuserRegisterResponse[]> {
    const option = { semester: new Types.ObjectId(semester), isDeleted: false };
    const creditMgt = await this.moneyCreditSchema.findOne(option);
    if (!creditMgt) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        settingMsg.notFoundMoneyCredit,
      );
    }
    const { moneyPerCredit } = creditMgt;
    for (const item of subjectList) {
      const numberCredits = item.subject?.numberCredits;
      item.totalMoney = moneyPerCredit * numberCredits;
    }
    return subjectList;
  }

  async getStudyProcessId(profileId: string): Promise<string> {
    const result = await this.studyprocessSchema.findOne({
      isDeleted: false,
      user: new Types.ObjectId(profileId),
    });
    if (!result) {
      new CommonException(HttpStatusCode.NOT_FOUND, studyProcessMsg.notFound);
    }
    return result._id;
  }
}
