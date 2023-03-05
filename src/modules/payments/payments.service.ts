import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { EstatusPayments } from 'src/constants/constant';
import { DbConnection } from 'src/constants/dbConnection';
import { CommonException } from 'src/exceptions/execeptionError';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.create.dto';
import { UpdateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/user.payments.create.dto';
import { UpdateUserPaymentDto } from './dtos/user.payments.update.dto';
import {
  MoneyPerCreditManagement,
  MoneyPerCreditManagementDocument,
} from './schemas/mgt-money-per-credit.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeDocument,
} from './schemas/payments.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(MoneyPerCreditManagement.name)
    private readonly moneyCreditSchema: Model<MoneyPerCreditManagementDocument>,
    @InjectModel(PaymentStudyFee.name)
    private readonly paymentSchema: Model<PaymentStudyFeeDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    private readonly db: DbConnection,
  ) {}

  async validateSemester(semester: string): Promise<void> {
    if (semester) {
      const semesterInfo = await this.semesterSchema.findById(semester);
      if (!semesterInfo) {
        new CommonException(404, 'Semester not found.');
      }
    }
  }

  async createMoneyPerCreditMgt(
    creditMgtDto: CreateMoneyPerCreditMgtDto,
  ): Promise<MoneyPerCreditManagement> {
    const { semester } = creditMgtDto;
    await this.validateSemester(semester);
    const creditInfo = await this.moneyCreditSchema.findOne({
      semester: new Types.ObjectId(semester),
    });
    if (creditInfo) {
      new CommonException(
        409,
        'Money per credit of this semester existed already.',
      );
    }
    const result = await new this.moneyCreditSchema(creditMgtDto).save();
    return result;
  }

  async updateMoneyPerCreditMgt(
    id: string,
    creditMgtDto: UpdateMoneyPerCreditMgtDto,
  ): Promise<MoneyPerCreditManagement> {
    const { semester } = creditMgtDto;
    await this.validateSemester(semester);
    await this.moneyCreditSchema.findByIdAndUpdate(id, creditMgtDto);
    const result = await this.findByIdMoneyPerCreditMgt(id);
    return result;
  }

  async findByIdMoneyPerCreditMgt(
    id: string,
  ): Promise<MoneyPerCreditManagement> {
    const result = await this.moneyCreditSchema
      .findById(id)
      .populate('semester', '', this.semesterSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Money per credit not found.');
    }
    return result;
  }

  async findAllMoneyPerCreditMgt(): Promise<MoneyPerCreditManagement[]> {
    const results = await this.moneyCreditSchema
      .find({})
      .populate('semester', '', this.semesterSchema)
      .exec();
    return results;
  }

  async createUserPayment(
    paymentDto: CreateUserPaymentDto,
  ): Promise<PaymentStudyFee> {
    const { user, semester } = paymentDto;
    const userInfo = await this.profileSchema.findById(user);
    if (!userInfo) {
      new CommonException(404, 'User profile not found.');
    }
    await this.validateSemester(semester);
    const result = await new this.paymentSchema(paymentDto).save();
    return result;
  }

  async updateUserPayment(
    id: string,
    paymentDto: UpdateUserPaymentDto,
  ): Promise<PaymentStudyFee> {
    const { semester } = paymentDto;
    await this.validateSemester(semester);
    await this.paymentSchema.findByIdAndUpdate(id, paymentDto);
    const result = await this.findUserPaymentById(id);
    return result;
  }

  async findUserPaymentById(id: string): Promise<PaymentStudyFee> {
    const result = await this.paymentSchema
      .findById(id)
      .populate('semester', '', this.semesterSchema)
      .populate('user', '', this.profileSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Payment user not found.');
    }
    return result;
  }

  async findTuitionUserInSemester(
    queryDto: QueryTuitionUser,
  ): Promise<Record<string, any>> {
    const { semester, profile } = queryDto;
    const studyprocess = await this.db
      .collection('studyprocesses')
      .findOne({ user: new Types.ObjectId(profile) });
    if (!studyprocess) {
      new CommonException(404, 'user study processes not found.');
    }
    const subjectIds = await this.getSubjectLists(semester);
    const match = {
      $match: {
        subject: { $in: subjectIds },
        studyprocess: studyprocess._id,
      },
    };
    const aggregate = [
      match,
      {
        $lookup: {
          from: 'subjects',
          localField: 'subject',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: '$subject' },
    ];
    const cursorAgg = await this.db
      .collection('subjectregisters')
      .aggregate(aggregate);
    const result = await cursorAgg.toArray();
    const listSubjectUser = await this.getTotalMoneySubject(result, semester);
    const tuitionInsemester = await this.paymentSchema.findOne({
      user: new Types.ObjectId(profile),
      semester: new Types.ObjectId(semester),
    });
    return {
      listSubjects: listSubjectUser,
      tuitionStatus: tuitionInsemester.status || EstatusPayments.OWED,
    };
  }

  async getSubjectLists(semester: string): Promise<ObjectId[]> {
    const subjectList = await this.db
      .collection('subjects')
      .find({ semester: new Types.ObjectId(semester), status: true });
    const subjectIds = subjectList.map((subject: any) => {
      return subject._id;
    });
    return subjectIds;
  }

  async getTotalMoneySubject(
    subjectList = [],
    semester: string,
  ): Promise<Record<string, any>[]> {
    const creditMgt = await this.moneyCreditSchema.findOne({
      semester: new Types.ObjectId(semester),
    });
    if (!creditMgt) {
      new CommonException(404, 'Credit management not found');
    }
    const { moneyPerCredit } = creditMgt;
    for (const item of subjectList) {
      const numberCredits = item.subject?.numberCredits;
      item.totalMoney = moneyPerCredit * numberCredits;
    }
    return subjectList;
  }
}
