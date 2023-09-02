import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SettingLearningRate,
  SettingLearningRateDocument,
} from './schemas/settings.learning-rating.schema';
import {
  SettingSubjectPass,
  SettingSubjectPassDocument,
} from './schemas/settings.subject-pass.schema';
import { Model, Types } from 'mongoose';
import { CreateSettingSubjectPassDto } from './dtos/settings.create.subject-pass.dto';
import { UpdateSettingSubjectPassDto } from './dtos/settings.update.subject-pass.dto';
import { CommonException } from 'src/exceptions/execeptions.common-error';
import {
  semesterMsg,
  settingMsg,
} from 'src/constants/constants.message.response';
import { QuerySettingSubjectPassDto } from './dtos/settings.query-subject-pass.dto';
import {
  IqueryMoneyCredit,
  IquerySettings,
} from './interfaces/settings.interface';
import { CreateSettingLearningRateDto } from './dtos/settings.create.learning-rate.dto';
import { UpdateSettingLearningRateDto } from './dtos/settings.update.learning-rate.dto';
import { QuerySettingLearningRateDto } from './dtos/settings.query-learning-rate.dto';
import {
  SettingMoneyCredit,
  SettingMoneyCreditDocument,
} from './schemas/settings.money-credit.schema';
import {
  Semester,
  SemesterDocument,
} from '../semesters/schemas/semesters.schema';
import { CreateSettingMoneyCreditDto } from './dtos/settings.create.money-credit.dto';
import { ValidFields } from 'src/validates/validates.fields-id-dto';
import { UpdateSettingMoneyCreditDto } from './dtos/settings.update.money-credit.dto';
import { selectSemester } from 'src/utils/utils.populate';
import { QuerySettingMoneyCreditDto } from './dtos/settings.query.money-credit.dto';
import { HttpStatusCode } from 'src/constants/constants.http-status';

@Injectable()
export class SettingsService {
  private populateSemester: string = 'semester';

  constructor(
    @InjectModel(SettingLearningRate.name)
    private readonly learningRateSchema: Model<SettingLearningRateDocument>,
    @InjectModel(SettingSubjectPass.name)
    private readonly subjectPassSchema: Model<SettingSubjectPassDocument>,
    @InjectModel(SettingMoneyCredit.name)
    private readonly moneyCreditSchema: Model<SettingMoneyCreditDocument>,
    @InjectModel(Semester.name)
    private readonly semesterSchema: Model<SemesterDocument>,
  ) {}

  public async createSettingSubjectPass(
    settingDto: CreateSettingSubjectPassDto,
    createdBy: string,
  ): Promise<SettingSubjectPass> {
    const result = await new this.subjectPassSchema({
      ...settingDto,
      createdBy,
    }).save();

    return result;
  }

  public async updateSettingSubjectPass(
    id: string,
    settingDto: UpdateSettingSubjectPassDto,
    updatedBy: string,
  ): Promise<SettingSubjectPass> {
    const updateDto = {
      ...settingDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.subjectPassSchema.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );

    return result;
  }

  public async findSettingSubjectPassById(
    id: string,
  ): Promise<SettingSubjectPass> {
    const result = await this.subjectPassSchema.findById(id);
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        settingMsg.notFoundSubjectPass,
      );
    }

    return result;
  }

  public async findAllSettingSubjectPass(
    queryDto: QuerySettingSubjectPassDto,
  ): Promise<{ results: SettingSubjectPass[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IquerySettings = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.subjectPassSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.subjectPassSchema.find(query).count();

    return { results, total };
  }

  public async deleteSettingSubjectPass(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    const deleteDto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.subjectPassSchema.findByIdAndUpdate(id, deleteDto);
  }

  public async createSettingLearningRate(
    settingDto: CreateSettingLearningRateDto,
    createdBy: string,
  ): Promise<SettingLearningRate> {
    const result = await new this.learningRateSchema({
      ...settingDto,
      createdBy,
    }).save();

    return result;
  }

  async updateSettingLearningRate(
    id: string,
    settingDto: UpdateSettingLearningRateDto,
    updatedBy: string,
  ): Promise<SettingLearningRate> {
    const updateDto = {
      ...settingDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const result = await this.learningRateSchema.findByIdAndUpdate(
      id,
      updateDto,
      {
        new: true,
      },
    );

    return result;
  }

  public async findSettingLearningRateById(
    id: string,
  ): Promise<SettingLearningRate> {
    const result = await this.learningRateSchema.findById(id);
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        settingMsg.notFoundLearningRate,
      );
    }

    return result;
  }

  public async findAllSettingLearningRate(
    queryDto: QuerySettingLearningRateDto,
  ): Promise<{ results: SettingLearningRate[]; total: number }> {
    const { limit, page, searchKey } = queryDto;
    const query: IquerySettings = { isDeleted: false };
    if (searchKey) {
      query.name = new RegExp(searchKey, 'i');
    }
    const results = await this.learningRateSchema
      .find(query)
      .skip(limit && page ? Number(limit) * Number(page) - Number(limit) : null)
      .limit(limit ? Number(limit) : null)
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.learningRateSchema.find(query).count();

    return { results, total };
  }

  public async deleteSettingLearningRate(
    id: string,
    deletedBy: string,
  ): Promise<void> {
    const deleteDto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.learningRateSchema.findByIdAndUpdate(id, deleteDto);
  }

  public async createSettingMoneyCredit(
    creditMgtDto: CreateSettingMoneyCreditDto,
    createdBy: string,
  ): Promise<SettingMoneyCredit> {
    const { semester } = creditMgtDto;
    const valid = new ValidFields();
    await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
    const option = { semester: new Types.ObjectId(semester), isDeleted: false };
    const existedMoneyCredit = await this.moneyCreditSchema.findOne(option);
    if (existedMoneyCredit) {
      new CommonException(
        HttpStatusCode.CONFLICT,
        settingMsg.existedMoneyCredit,
      );
    }
    const dto = {
      ...creditMgtDto,
      createdBy,
    };
    const result = await new this.moneyCreditSchema(dto).save();

    return result;
  }

  public async updateSettingMoneyCredit(
    id: string,
    creditMgtDto: UpdateSettingMoneyCreditDto,
    updatedBy: string,
  ): Promise<SettingMoneyCredit> {
    const { semester } = creditMgtDto;
    if (semester) {
      const valid = new ValidFields();
      await valid.id(this.semesterSchema, semester, semesterMsg.notFound);
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

  public async findSettingMoneyCreditById(
    id: string,
  ): Promise<SettingMoneyCredit> {
    const result = await this.moneyCreditSchema
      .findById(id)
      .populate(this.populateSemester, selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .exec();
    if (!result) {
      new CommonException(
        HttpStatusCode.NOT_FOUND,
        settingMsg.notFoundMoneyCredit,
      );
    }

    return result;
  }

  public async findAllSettingMoneyCredit(
    queryDto: QuerySettingMoneyCreditDto,
  ): Promise<{ results: SettingMoneyCredit[]; total: number }> {
    const { limit, page, searchKey, semester } = queryDto;
    const query: IqueryMoneyCredit = { isDeleted: false };
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
      .populate(this.populateSemester, selectSemester, this.semesterSchema, {
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean();
    const total = await this.moneyCreditSchema.find(query).count();

    return { results, total };
  }
}
