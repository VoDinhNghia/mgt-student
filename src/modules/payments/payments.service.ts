import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EstatusPayments } from 'src/constants/constant';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { getRandomCodeReceiptId } from 'src/utils/generate.code-payment';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { SubjectUserRegister } from 'src/utils/user.register-subject.query';
import { ValidateDto } from 'src/validates/validate.common.dto';
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
  ) {}

  async createMoneyPerCreditMgt(
    creditMgtDto: CreateMoneyPerCreditMgtDto,
  ): Promise<MoneyPerCreditManagement> {
    const { semester } = creditMgtDto;
    await this.validateSemesterDto(semester);
    const option = { semester: new Types.ObjectId(semester) };
    await new ValidateDto().existedByOptions(
      'moneypercreditmanagements',
      option,
      'Money per credit',
    );
    const result = await new this.moneyCreditSchema(creditMgtDto).save();
    return result;
  }

  async updateMoneyPerCreditMgt(
    id: string,
    creditMgtDto: UpdateMoneyPerCreditMgtDto,
  ): Promise<MoneyPerCreditManagement> {
    const { semester } = creditMgtDto;
    await this.validateSemesterDto(semester);
    await this.moneyCreditSchema.findByIdAndUpdate(id, creditMgtDto);
    const result = await this.findByIdMoneyPerCreditMgt(id);
    return result;
  }

  async findByIdMoneyPerCreditMgt(
    id: string,
  ): Promise<MoneyPerCreditManagement> {
    let aggregate = [{ $match: { _id: new Types.ObjectId(id) } }];
    const lookup = this.lookupPayment();
    aggregate = [...aggregate, ...lookup];
    const result = await this.moneyCreditSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Money per credit not found.');
    }
    return result[0];
  }

  async findAllMoneyPerCreditMgt(): Promise<MoneyPerCreditManagement[]> {
    const lookup = this.lookupPayment();
    const results = await this.moneyCreditSchema.aggregate(lookup);
    return results;
  }

  async createUserPayment(
    paymentDto: CreateUserPaymentDto,
  ): Promise<PaymentStudyFee> {
    const { user, semester } = paymentDto;
    await new ValidateDto().fieldId('profiles', user);
    await this.validateSemesterDto(semester);
    const newPaymentDto: CreateUserPaymentDto & { receiptId: string } = {
      ...paymentDto,
      receiptId: getRandomCodeReceiptId(4),
    };
    const userPayment = await new this.paymentSchema(newPaymentDto).save();
    const result = await this.findUserPaymentById(userPayment._id);
    return result;
  }

  async updateUserPayment(
    id: string,
    paymentDto: UpdateUserPaymentDto,
  ): Promise<PaymentStudyFee> {
    const { semester } = paymentDto;
    await this.validateSemesterDto(semester);
    await this.paymentSchema.findByIdAndUpdate(id, paymentDto);
    const result = await this.findUserPaymentById(id);
    return result;
  }

  async findUserPaymentById(id: string): Promise<PaymentStudyFee> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = this.lookupUserPayment();
    const aggregate = [match, ...this.lookupPayment(), ...lookup];
    const result = await this.paymentSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Payment user not found.');
    }
    return result[0];
  }

  async findTuitionUserInSemester(
    queryDto: QueryTuitionUser,
  ): Promise<{ subjects: Record<string, any>; tuitionStatus: string }> {
    const { semester, profile } = queryDto;
    await this.validateSemesterDto(semester);
    const options = {
      user: new Types.ObjectId(profile),
      semester: new Types.ObjectId(semester),
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
    subjectList = [],
    semester: string,
  ): Promise<Record<string, any>[]> {
    const option = { semester: new Types.ObjectId(semester) };
    const creditMgt = await this.moneyCreditSchema.findOne(option);
    if (!creditMgt) {
      new CommonException(404, 'Money per credit not found.');
    }
    const { moneyPerCredit } = creditMgt;
    for (const item of subjectList) {
      const numberCredits = item.subject?.numberCredits;
      item.totalMoney = moneyPerCredit * numberCredits;
    }
    return subjectList;
  }

  async validateSemesterDto(semester: string): Promise<void> {
    if (semester) {
      await new ValidateDto().fieldId('semesters', semester);
    }
  }

  private lookupUserPayment() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        unwind: true,
      },
    ]);
    return [...this.lookupPayment(), ...lookup];
  }

  private lookupPayment() {
    const lookup: any = new LookupCommon([
      {
        from: 'semester',
        localField: 'semester',
        foreignField: '_id',
        as: 'semester',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
