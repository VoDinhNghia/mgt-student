/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { EstatusPayments } from 'src/constants/constant';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { getRandomCodeReceiptId } from 'src/utils/generate.code-payment';
import { SubjectUserRegister } from 'src/utils/user.register-subject.query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateMoneyPerCreditMgtDto } from './dtos/payments.mgt-money-per-credit.create.dto';
import { UpdateMoneyPerCreditMgtDto } from './dtos/payment.mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/payments.query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/payments.users.create.dto';
import { UpdateUserPaymentDto } from './dtos/payments.users.update.dto';
import {
  Money_Per_Credit_Mgt,
  MoneyPerCreditManagementDocument,
} from './schemas/payments.mgt-money-per-credit.schema';
import {
  Payment_Study_Fee,
  PaymentStudyFeeDocument,
} from './schemas/payments.schema';
import {
  paymentLookup,
  userPaymentLookup,
} from 'src/utils/lookup.query.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Money_Per_Credit_Mgt.name)
    private readonly moneyCreditSchema: Model<MoneyPerCreditManagementDocument>,
    @InjectModel(Payment_Study_Fee.name)
    private readonly paymentSchema: Model<PaymentStudyFeeDocument>,
  ) {}

  async createMoneyPerCreditMgt(
    creditMgtDto: CreateMoneyPerCreditMgtDto,
    createdBy: string,
  ): Promise<Money_Per_Credit_Mgt> {
    const { semester } = creditMgtDto;
    const validate = new ValidateDto();
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
    }
    const option = { semester: new Types.ObjectId(semester), isDeleted: false };
    await new ValidateDto().existedByOptions(
      collections.money_per_credit_mgts,
      option,
      'Money per credit',
    );
    const dto = {
      creditMgtDto,
      createdBy,
    };
    const result = await new this.moneyCreditSchema(dto).save();
    return result;
  }

  async updateMoneyPerCreditMgt(
    id: string,
    creditMgtDto: UpdateMoneyPerCreditMgtDto,
    updatedBy: string,
  ): Promise<Money_Per_Credit_Mgt> {
    const { semester } = creditMgtDto;
    const validate = new ValidateDto();
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
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

  async findByIdMoneyPerCreditMgt(id: string): Promise<Money_Per_Credit_Mgt> {
    let aggregate = [
      { $match: { _id: new Types.ObjectId(id), isDeleted: false } },
    ];
    const lookup = paymentLookup();
    aggregate = [...aggregate, ...lookup];
    const result = await this.moneyCreditSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllMoneyPerCreditMgt(): Promise<Money_Per_Credit_Mgt[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = paymentLookup();
    const aggregate = [match, ...lookup];
    const results = await this.moneyCreditSchema.aggregate(aggregate);
    return results;
  }

  async createUserPayment(
    paymentDto: CreateUserPaymentDto,
    createdBy: string,
  ): Promise<Payment_Study_Fee> {
    const { user, semester } = paymentDto;
    await new ValidateDto().fieldId(collections.profiles, user);
    const validate = new ValidateDto();
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
    }
    const newPaymentDto: CreateUserPaymentDto & {
      receiptId: string;
      createdBy: string;
    } = {
      ...paymentDto,
      receiptId: getRandomCodeReceiptId(4),
      createdBy,
    };
    const userPayment = await new this.paymentSchema(newPaymentDto).save();
    const result = await this.findUserPaymentById(userPayment._id);
    return result;
  }

  async updateUserPayment(
    id: string,
    paymentDto: UpdateUserPaymentDto,
    updatedBy: string,
  ): Promise<Payment_Study_Fee> {
    const { semester } = paymentDto;
    const validate = new ValidateDto();
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
    }
    const dto = {
      ...paymentDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.paymentSchema.findByIdAndUpdate(id, dto);
    const result = await this.findUserPaymentById(id);
    return result;
  }

  async findUserPaymentById(id: string): Promise<Payment_Study_Fee> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookupUserPayment = userPaymentLookup();
    const lookupPayment = paymentLookup();
    const aggregate = [match, ...lookupPayment, ...lookupUserPayment];
    const result = await this.paymentSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findTuitionUserInSemester(
    queryDto: QueryTuitionUser,
  ): Promise<{ subjects: Record<string, any>; tuitionStatus: string }> {
    const { semester, profile } = queryDto;
    const validate = new ValidateDto();
    if (semester) {
      await validate.fieldId(collections.semesters, semester);
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
    subjectList = [],
    semester: string,
  ): Promise<Record<string, any>[]> {
    const option = { semester: new Types.ObjectId(semester), isDeleted: false };
    const creditMgt = await this.moneyCreditSchema.findOne(option);
    if (!creditMgt) {
      new CommonException(404, msgNotFound);
    }
    const { moneyPerCredit } = creditMgt;
    for (const item of subjectList) {
      const numberCredits = item.subject?.numberCredits;
      item.totalMoney = moneyPerCredit * numberCredits;
    }
    return subjectList;
  }
}
