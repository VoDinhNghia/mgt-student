import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstatusPayments } from 'src/constants/constant';
import {
  paymentMsg,
  semesterMsg,
  userMsg,
} from 'src/constants/constants.message.response';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import { getRandomCodeReceiptId } from 'src/utils/utils.generate.code-payment';
import { SubjectUserRegister } from 'src/utils/utils.user.register-subject.query';
import { CreateMoneyPerCreditMgtDto } from './dtos/payments.mgt-money-per-credit.create.dto';
import { UpdateMoneyPerCreditMgtDto } from './dtos/payments.mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/payments.query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/payments.users.create.dto';
import { UpdateUserPaymentDto } from './dtos/payments.users.update.dto';
import {
  MoneyPerCreditMgt,
  MoneyPerCreditManagementDocument,
} from './schemas/payments.mgt-money-per-credit.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeDocument,
} from './schemas/payments.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { selectSemester, selectUser } from 'src/utils/utils.populate';
import { QueryMgtMoneyPerCreditDto } from './dtos/payments.query.mgt-money-per-credit.dto';
import { IqueryMgtMoneyPerCredit } from './interfaces/payments.query.mgt-money-per-credit.interface';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { IuserRegisterResponse } from './interfaces/payments.find.user-tuition.interface';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(MoneyPerCreditMgt.name)
    private readonly moneyCreditSchema: Model<MoneyPerCreditManagementDocument>,
    @InjectModel(PaymentStudyFee.name)
    private readonly paymentSchema: Model<PaymentStudyFeeDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
  ) {}

  async createMoneyPerCreditMgt(
    creditMgtDto: CreateMoneyPerCreditMgtDto,
    createdBy: string,
  ): Promise<MoneyPerCreditMgt> {
    const { semester } = creditMgtDto;
    const semesterInfo = await this.semesterSchema.findOne({
      _id: new Types.ObjectId(semester),
      isSelected: false,
    });
    if (!semesterInfo) {
      new CommonException(404, semesterMsg.notFound);
    }
    const option = { semester: new Types.ObjectId(semester), isDeleted: false };
    const existedMoneyCredit = await this.moneyCreditSchema.findOne(option);
    if (existedMoneyCredit) {
      new CommonException(409, paymentMsg.existedMoneyCreditMgt);
    }
    const dto = {
      ...creditMgtDto,
      createdBy,
    };
    const result = await new this.moneyCreditSchema(dto).save();
    return result;
  }

  async updateMoneyPerCreditMgt(
    id: string,
    creditMgtDto: UpdateMoneyPerCreditMgtDto,
    updatedBy: string,
  ): Promise<MoneyPerCreditMgt> {
    const { semester } = creditMgtDto;
    if (semester) {
      const semesterInfo = await this.semesterSchema.findOne({
        _id: new Types.ObjectId(semester),
        isSelected: false,
      });
      if (!semesterInfo) {
        new CommonException(404, semesterMsg.notFound);
      }
    }
    const dto = {
      ...creditMgtDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.moneyCreditSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });
    return result;
  }

  async findByIdMoneyPerCreditMgt(id: string): Promise<MoneyPerCreditMgt> {
    const result = await this.moneyCreditSchema
      .findById(id)
      .populate('semester', selectSemester, this.semesterSchema)
      .exec();
    if (!result) {
      new CommonException(404, paymentMsg.notFound);
    }
    return result;
  }

  async findAllMoneyPerCreditMgt(
    queryDto: QueryMgtMoneyPerCreditDto,
  ): Promise<{ results: MoneyPerCreditMgt[]; total: number }> {
    const { limit, page, searchKey, semester } = queryDto;
    const query: IqueryMgtMoneyPerCredit = { isDeleted: false };
    if (semester) {
      query.semester = new Types.ObjectId(semester);
    }
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.moneyCreditSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .populate('semester', selectSemester, this.semesterSchema)
      .lean();
    const total = await this.moneyCreditSchema.find(query).count();
    return { results, total };
  }

  async createUserPayment(
    paymentDto: CreateUserPaymentDto,
    createdBy: string,
  ): Promise<PaymentStudyFee> {
    const { user, semester } = paymentDto;
    const profile = await this.profileSchema.findOne({
      _id: new Types.ObjectId(user),
      isDeleted: false,
    });
    if (!profile) {
      new CommonException(404, userMsg.notFoundProfile);
    }
    const semesterInfo = await this.semesterSchema.findOne({
      _id: new Types.ObjectId(semester),
      isSelected: false,
    });
    if (!semesterInfo) {
      new CommonException(404, semesterMsg.notFound);
    }
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
      const semesterInfo = await this.semesterSchema.findOne({
        _id: new Types.ObjectId(semester),
        isSelected: false,
      });
      if (!semesterInfo) {
        new CommonException(404, semesterMsg.notFound);
      }
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
      .populate('user', selectUser, this.profileSchema)
      .populate('semester', selectSemester, this.semesterSchema)
      .exec();
    if (!result) {
      new CommonException(404, paymentMsg.notFoundUserPayment);
    }
    return result;
  }

  async findTuitionUserInSemester(
    queryDto: QueryTuitionUser,
  ): Promise<{ subjects: IuserRegisterResponse[]; tuitionStatus: string }> {
    const { semester, profile } = queryDto;
    if (semester) {
      const semesterInfo = await this.semesterSchema.findOne({
        _id: new Types.ObjectId(semester),
        isSelected: false,
      });
      if (!semesterInfo) {
        new CommonException(404, semesterMsg.notFound);
      }
    }
    const options = {
      user: new Types.ObjectId(profile),
      semester: new Types.ObjectId(semester),
      isDeleted: false,
    };
    const service = new SubjectUserRegister();
    const subjectIds = await service.getSubjectIds(semester);
    const subjects = await service.getUserSubjects(profile, subjectIds);
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
      new CommonException(404, paymentMsg.notFound);
    }
    const { moneyPerCredit } = creditMgt;
    for (const item of subjectList) {
      const numberCredits = item.subject?.numberCredits;
      item.totalMoney = moneyPerCredit * numberCredits;
    }
    return subjectList;
  }
}
