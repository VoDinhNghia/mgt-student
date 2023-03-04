import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { DbConnection } from 'src/constants/dbConnection';
import { CommonException } from 'src/exceptions/execeptionError';
import { QueryTuitionUser } from './dtos/query.tuition-user.dto';
import {
  CreditManagement,
  CreditManagementDocument,
} from './schemas/creditManagement.schema';
import {
  PaymentStudyFee,
  PaymentStudyFeeDocument,
} from './schemas/payments.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(CreditManagement.name)
    private readonly creditManageSchema: Model<CreditManagementDocument>,
    @InjectModel(PaymentStudyFee.name)
    private readonly paymentSchema: Model<PaymentStudyFeeDocument>,
    private readonly db: DbConnection,
  ) {}
  // Will have method get tuition of user,
  // check paymentstudyfees is null,
  // check subjectregisters of user (have register in semester),
  // create new document in paymentstudyfees(status false)
  // controller api path is /:userId
  // method create (cashier role) => check user, semester if !null => update status => true
  // if payment is online ? what is flow?

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
    const creditMgt = await this.creditManageSchema.findOne({
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
