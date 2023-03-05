import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { DbConnection } from 'src/constants/dbConnection';
import { CommonException } from 'src/exceptions/execeptionError';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { CreateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.create.dto';
import { UpdateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/query.tuition-user.dto';
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
    private readonly db: DbConnection,
  ) {}

  async validateMoneyPerCreditMgt(
    creditMgtDto: CreateMoneyPerCreditMgtDto,
  ): Promise<void> {
    const { semester } = creditMgtDto;
    if (semester) {
      const semesterInfo = await this.semesterSchema.findOne({
        _id: new Types.ObjectId(semester),
      });
      if (!semesterInfo) {
        new CommonException(404, 'Semester not found.');
      }
      const creditInfo = await this.moneyCreditSchema.findOne({
        semester: new Types.ObjectId(semester),
      });
      if (creditInfo) {
        new CommonException(
          409,
          'Money per credit of this semester existed already.',
        );
      }
    }
  }

  async createMoneyPerCreditMgt(
    creditMgtDto: CreateMoneyPerCreditMgtDto,
  ): Promise<MoneyPerCreditManagement> {
    await this.validateMoneyPerCreditMgt(creditMgtDto);
    const result = await new this.moneyCreditSchema(creditMgtDto).save();
    return result;
  }

  async updateMoneyPerCreditMgt(
    id: string,
    creditMgtDto: UpdateMoneyPerCreditMgtDto,
  ): Promise<MoneyPerCreditManagement> {
    await this.validateMoneyPerCreditMgt(creditMgtDto);
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

  // async createUserPayment()

  async findTuitionUserInSemester(
    queryDto: QueryTuitionUser,
  ): Promise<Record<string, any>> {
    const { semester, userProcess } = queryDto;
    const subjectIds = await this.getSubjectLists(semester);
    const match = {
      $match: {
        subject: { $in: subjectIds },
        studyprocess: new Types.ObjectId(userProcess),
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
    return listSubjectUser;
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
